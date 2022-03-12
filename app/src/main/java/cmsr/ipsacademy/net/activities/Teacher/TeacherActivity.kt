package cmsr.ipsacademy.net.activities

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import cmsr.ipsacademy.net.R
import com.google.android.material.navigation.NavigationView

class TeacherAc : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_teacher)
        val toolbar = findViewById<Toolbar>(R.id.toolBar)
        setSupportActionBar(toolbar)

        val navigationView = findViewById<NavigationView>(R.id.teacher_menu)
        navigationView.setItemIconTintList(null)
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawer)


        val actionBarDrawerToggle =
            ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open, R.string.close)
        drawerLayout.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()

        navigationView.setNavigationItemSelectedListener(NavigationView.OnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.ClassCoordinator -> Toast.makeText(
                    applicationContext,
                    "Class Coordinator",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.MyStudent -> Toast.makeText(applicationContext, "MyStudent", Toast.LENGTH_SHORT)
                    .show()
                R.id.SubjectCoordinator -> Toast.makeText(
                    applicationContext,
                    "Subject Coordinator",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.Events -> Toast.makeText(
                    applicationContext,
                    "Events",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.Feedbacks -> Toast.makeText(
                    applicationContext,
                    "Feedbacks",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.NBA -> Toast.makeText(applicationContext, "NBA", Toast.LENGTH_SHORT).show()
                R.id.UpdateStudentDetail -> Toast.makeText(applicationContext, "UpdateStudentDetail", Toast.LENGTH_SHORT)
                    .show()
                R.id.onlineexam -> Toast.makeText(
                    applicationContext,
                    "online exam",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.subjectCoordinator -> Toast.makeText(
                    applicationContext,
                    "subjectCoordinator",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.myStudent -> Toast.makeText(
                    applicationContext,
                    "myStudent",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.attendance -> Toast.makeText(
                    applicationContext,
                    "attendance",
                    Toast.LENGTH_SHORT
                ).show()
                R.id.events-> Toast.makeText(
                    applicationContext,
                    "events",
                    Toast.LENGTH_SHORT
                ).show()
            }
            true
        })

    }
}