package cmsr.ipsacademy.net.activities

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.Util.SharedPreference
import cmsr.ipsacademy.net.activities.models.StudentInfo
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import com.google.android.material.navigation.NavigationView
import retrofit2.Call
import retrofit2.Response

class Student : AppCompatActivity() {

    private var sharedPreference: SharedPreference? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_student)
        val toolbar = findViewById<Toolbar>(R.id.toolBar)
        setSupportActionBar(toolbar)

        sharedPreference = SharedPreference(this)

        getStudentDetails()

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


    private fun getStudentDetails() {
        val computer_code = "52684"
        val userApi = controller.getInstance().create(apiset::class.java)


        userApi.getStudentDetails(computer_code)
            .enqueue(object : retrofit2.Callback<StudentInfo> {
                override fun onResponse(
                    call: Call<StudentInfo>,
                    response: Response<StudentInfo>
                ) {

                    if (response.body() != null){
                        Log.d("name", "Student name:-" + response.body()!!.student_info[0].student_name)
                    }

                }

                override fun onFailure(call: Call<StudentInfo>, t: Throwable) {
                    Log.d("error", t.toString())
                }
            })

    }
}