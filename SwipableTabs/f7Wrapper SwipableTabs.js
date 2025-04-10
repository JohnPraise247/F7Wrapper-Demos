app.LoadPlugin( "F7Wrapper" )

class App {
    onInit(){
       f7.setBackColor("#2c2d2e")
    }
    onStart() {
        f7.addPage("home.html", {},true);      
    }
    onBack(){
       app.Exit( )
    }
}