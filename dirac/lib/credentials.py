import logging
import os.path
from pylons import request

from dirac.lib.base import *
from dirac.lib.webconfig import gWebConfig
from dirac.lib.sanitizeInputs import sanitizeAllWebInputs

from DIRAC import gLogger
from DIRAC.Core.DISET.AuthManager import AuthManager
from DIRAC.Core.Security import CS, X509Certificate

gAuthManager = AuthManager( "%s/Authorization" % gWebConfig.getWebSection() )

log = logging.getLogger( __name__ )
diracLogger = gLogger.getSubLogger( "Credentials" )

def checkURL( environ, routesDict ):
  #Before all we try to sanitize inputs
  sanitizeAllWebInputs( environ )
  #Time for Auth!
  routesDict[ 'dsetup' ] = __checkSetup( routesDict[ 'dsetup' ] )
  userDN, userName = __checkDN( environ )
  userGroup, availableGroups = __checkGroup( userName, routesDict[ 'dgroup' ] )
  routesDict[ 'dgroup' ] = userGroup
  environ[ 'DIRAC.userCredentials' ] = { 'DN' : userDN,
                                         'username' : userName,
                                         'group' : userGroup,
                                         'availableGroups' : availableGroups
                                        }
  if not authorizeAction( routesDict, environ[ 'DIRAC.userCredentials' ] ):
    routesDict[ 'controller' ] = "web/userdata"
    routesDict[ 'action' ] = "unauthorizedAction"
    routesDict[ 'id' ] = None
  return True

def __checkSetup( setup ):
  if setup not in gWebConfig.getSetups():
    return gWebConfig.getDefaultSetup()
  return setup

def __checkDN( environ ):
  userDN = False
  if 'SERVER_SOFTWARE' not in environ:
    diracLogger.info( "Getting the DN from /Website/DebugDN" )
    userDN = gWebConfig.getDebugDN()
  if 'HTTPS' in environ and environ[ 'HTTPS' ] == 'on':
    if 'SSL_CLIENT_S_DN' in environ:
      userDN = environ[ 'SSL_CLIENT_S_DN' ]
    elif 'SSL_CLIENT_CERT' in environ:
      userCert = X509Certificate.X509Certificate()
      result = userCert.loadFromString( environ[ 'SSL_CLIENT_CERT' ] )
      if not result[ 'OK' ]:
        diracLogger.error( "Could not load SSL_CLIENT_CERT: %s" % result[ 'Message' ] )
        userName = "anonymous"
      else:
        userDN = userCert.getSubjectDN()[ 'Value' ]
    else:
      diracLogger.error( "Web server is not properly configured to get SSL_CLIENT_S_DN or SSL_CLIENT_CERT in env" )
  if not userDN:
    userName = "anonymous"
  else:
    retVal = CS.getUsernameForDN( userDN )
    if not retVal[ 'OK' ]:
      userName = "anonymous"
    else:
      userName = retVal[ 'Value' ]
  diracLogger.info( "Got username for user" " => %s for %s" % ( userName, userDN ) )
  return ( userDN, userName )

def __checkGroup( userName, group ):
  retVal = CS.getGroupsForUser( userName )
  if not retVal[ 'OK' ]:
    availableGroups = []
  else:
    availableGroups = retVal[ 'Value' ]
  if group in availableGroups:
    return ( group, availableGroups )

  defaultGroup = False
  for tgroup in gWebConfig.getDefaultGroups():
    if tgroup in availableGroups:
      defaultGroup = tgroup
      break
  if not defaultGroup:
    defaultGroup = "visitor"
  return ( defaultGroup, availableGroups )

def checkUserCredentials():
  routesDict = request.environ[ 'pylons.routes_dict' ]
  environ = request.environ
  if 'dsetup' in routesDict:
    routesDict[ 'dsetup' ] = __checkSetup( routesDict[ 'dsetup' ] )
  else:
    routesDict[ 'dsetup' ] = gWebConfig.getDefaultSetup()
  userDN, userName = __checkDN( environ )
  if 'dgroup' not in routesDict:
    routesDict[ 'dgroup' ] = 'visitor'
  userGroup, availableGroups = __checkGroup( userName, routesDict[ 'dgroup' ] )
  routesDict[ 'dgroup' ] = userGroup
  environ[ 'DIRAC.userCredentials' ] = { 'DN' : userDN,
                                         'username' : userName,
                                         'group' : userGroup,
                                         'availableGroups' : availableGroups
                                       }

def authorizeAction( routeDict = False, userCred = False ):
  if not routeDict:
    routeDict = request.environ[ 'pylons.routes_dict' ]
  actionPath = "%s/%s" % ( routeDict[ 'controller' ], routeDict[ 'action' ] )
  if not userCred:
    userCred = request.environ[ 'DIRAC.userCredentials' ]
  userRep = "%s@%s" % ( userCred[ 'username' ], userCred[ 'group' ] )
  diracLogger.info( "Testing %s for %s action" % ( userRep, actionPath ) )
  if gAuthManager.authQuery( actionPath, userCred, defaultProperties = 'all' ):
    diracLogger.info( "Authorized %s for %s" % ( actionPath, userRep ) )
    return True
  diracLogger.info( "NOT authorized %s for %s" % ( actionPath, userRep ) )
  return False

def getUsername():
  if 'DIRAC.userCredentials' in request.environ:
    return request.environ[ 'DIRAC.userCredentials' ][ 'username' ]
  else:
    return "anonymous"

def getUserDN():
  if 'DIRAC.userCredentials' in request.environ:
    return request.environ[ 'DIRAC.userCredentials' ][ 'DN' ]
  else:
    return ""

def getSelectedSetup():
  setup = request.environ[ 'pylons.routes_dict' ][ 'dsetup' ]
  if setup not in gWebConfig.getSetups():
   return gWebConfig.getDefaultSetup()
  return setup

def getSelectedGroup():
  if 'DIRAC.userCredentials' in request.environ:
    return request.environ[ 'DIRAC.userCredentials' ][ 'group' ]
  else:
    return "visitor"

def getProperties( group = False ):
  if not group:
    group = getSelectedGroup()
  if 'visitor' == group:
    return []
  return CS.getPropertiesForGroup( group )

def getAvailableGroups():
  if 'DIRAC.userCredentials' in request.environ:
    return request.environ[ 'DIRAC.userCredentials' ][ 'availableGroups' ]
  else:
    return []
