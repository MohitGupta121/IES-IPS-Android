package cmsr.ipsacademy.net.activities


import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.Util.SharedPreference
import com.google.android.material.navigation.NavigationView
import com.google.firebase.auth.FirebaseAuth

class MainActivity : AppCompatActivity() {

    private lateinit var navController: NavController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val toolbar = findViewById<Toolbar>(R.id.toolBar)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.frame_layout_container) as NavHostFragment
        navController = navHostFragment.navController


        val navigationView = findViewById<NavigationView>(R.id.navigation_menu)
        navigationView.setItemIconTintList(null)
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawer)

        val actionBarDrawerToggle =
            ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open, R.string.close)
        drawerLayout.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()

        navigationView.setupWithNavController(navController)

        val sharedPreference:SharedPreference = SharedPreference(this)

    }
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

}