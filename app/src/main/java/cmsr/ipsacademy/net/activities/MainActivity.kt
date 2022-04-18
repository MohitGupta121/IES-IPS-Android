package cmsr.ipsacademy.net.activities


import android.os.Bundle
import android.util.Log
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
import cmsr.ipsacademy.net.activities.models.StudentInfo
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.ActivityMainBinding
import com.google.android.material.navigation.NavigationView
import com.google.firebase.auth.FirebaseAuth
import retrofit2.Call
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var navController: NavController
    private lateinit var binding: ActivityMainBinding
    private var sharedPreference: SharedPreference? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreference = SharedPreference(this)

        val toolbar = findViewById<Toolbar>(R.id.toolBar)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.frame_layout_container) as NavHostFragment
        navController = navHostFragment.navController

        binding.navigationMenu.setItemIconTintList(null)

        val actionBarDrawerToggle =
            ActionBarDrawerToggle(this, binding.drawer, toolbar, R.string.open, R.string.close)
        binding.drawer.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()

        binding.navigationMenu.setupWithNavController(navController)

        sharedPreference?.getValueString("computer_code")?.let { getUserDetails(it) }
        binding.role.setText(sharedPreference?.getValueString("role"))

    }

    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

    private fun getUserDetails(computer_code: String) {

        val userApi = controller.getInstance().create(apiset::class.java)
        userApi.getStudentDetails(computer_code)
            .enqueue(object : retrofit2.Callback<StudentInfo> {
                override fun onResponse(
                    call: Call<StudentInfo>,
                    response: Response<StudentInfo>
                ) {
                    if (response.body() != null) {
                        binding.name.setText(response.body()!!.student_info[0].student_name)
                        Log.d(
                            "name",
                            "Student name:-" + response.body()!!.student_info[0].student_name
                        )
                    }
                }

                override fun onFailure(call: Call<StudentInfo>, t: Throwable) {
                    Log.d("error", t.toString())
                }
            })

    }

}