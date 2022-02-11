package cmsr.ipsacademy.net.activities

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import cmsr.ipsacademy.net.R
import com.google.android.material.navigation.NavigationView

class Student : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_student)
        val toolbar = findViewById<Toolbar>(R.id.toolBar)
        setSupportActionBar(toolbar)

        val navigationView = findViewById<NavigationView>(R.id.navigation_menu)
        navigationView.setItemIconTintList(null)
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawer)


        val actionBarDrawerToggle =
            ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open, R.string.close)
        drawerLayout.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()

        navigationView.setNavigationItemSelectedListener(NavigationView.OnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_settings -> Toast.makeText(
                    applicationContext,
                    "setting",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.nav_logout -> Toast.makeText(applicationContext, "logout", Toast.LENGTH_SHORT)
                    .show()
                R.id.Dashboard -> Toast.makeText(
                    applicationContext,
                    "dashboard",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.Assignment -> Toast.makeText(
                    applicationContext,
                    "assignment",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.Attendance -> Toast.makeText(
                    applicationContext,
                    "attendance",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.MST -> Toast.makeText(applicationContext, "mst", Toast.LENGTH_SHORT).show()
                R.id.feedback -> Toast.makeText(applicationContext, "feedback", Toast.LENGTH_SHORT)
                    .show()
                R.id.onlineexam -> Toast.makeText(
                    applicationContext,
                    "online exam",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.applyonline -> Toast.makeText(
                    applicationContext,
                    "apply online",
                    Toast.LENGTH_SHORT
                ).show()
            }
            true
        })

    }
}