import logging
import os

from dirac.lib.base import *

log = logging.getLogger( __name__ )

class GeneralController( BaseController ):

  def index( self ):
    return redirect_to( controller = "info/general", action = "diracOverview" )

  def diracOverview( self ):
    return render( "/info/diracOverview.mako" )

  def diracWhitepaper( self ):
    return render( "/info/diracOverview.mako" )

  def teamPeople( self ):
    return render( "/info/diracOverview.mako" )

  def teamRestaurants( self ):
    return render( "/info/diracOverview.mako" )

  def teamPubs( self ):
    return render( "/info/diracOverview.mako" )

  def download( self ):
    return render( "/info/diracOverview.mako" )

  def logos( self ):
    c.imagePath = "%s/public/images/logos/" % os.path.dirname( os.path.dirname( os.path.dirname( os.path.abspath( __file__ ) ) ) )
    return render( "/info/logos.mako" )

  def ext4test( self ):
    return render( "/info/ext4test.mako" )
