package cmsr.ipsacademy.net.activities


import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.models.faculty.FacultyInfoModel
import cmsr.ipsacademy.net.helpers.SharedPreferencesHelper
import cmsr.ipsacademy.net.activities.models.student.StudentInfoModel
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.ActivityMainBinding
import cmsr.ipsacademy.net.helpers.AppConstants
import retrofit2.Call
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var navController: NavController
    private lateinit var binding: ActivityMainBinding
    private var sharedPreferencesHelper: SharedPreferencesHelper? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferencesHelper = SharedPreferencesHelper(this)

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

        sharedPreferencesHelper?.getValueString(AppConstants.computer_code)
            ?.let { getUserDetails(it) }
        binding.role.setText(sharedPreferencesHelper?.getValueString(AppConstants.user_role))

    }

    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

    private fun getUserDetails(computer_code: String) {

        val userApi = controller.getInstance().create(apiset::class.java)

        // If role is Student then get Student Details
        if (sharedPreferencesHelper?.getValueString(AppConstants.user_role)
                .equals(getString(R.string.role_student))
        ) {
            userApi.getStudentDetails(computer_code)
                .enqueue(object : retrofit2.Callback<StudentInfoModel> {
                    override fun onResponse(
                        call: Call<StudentInfoModel>,
                        response: Response<StudentInfoModel>
                    ) {
                        if (response.body() != null) {
                            binding.name.setText(response.body()!!.student_info[0].student_name)
                            Log.d(
                                "name",
                                "Student name:-" + response.body()!!.student_info[0].student_name
                            )
                        }
                    }

                    override fun onFailure(call: Call<StudentInfoModel>, t: Throwable) {
                        Log.d("error", t.toString())
                    }
                })
        } else {
            userApi.getFacultyDetails(computer_code)
                .enqueue(object : retrofit2.Callback<FacultyInfoModel> {
                    @SuppressLint("SetTextI18n")
                    override fun onResponse(
                        call: Call<FacultyInfoModel>,
                        response: Response<FacultyInfoModel>
                    ) {
                        if (response.body() != null) {
                            binding.name.setText(response.body()!!.faculty_info[0].first_name + " " + response.body()!!.faculty_info[0].last_name)
                        }
                    }

                    override fun onFailure(call: Call<FacultyInfoModel>, t: Throwable) {
                        Log.d("error", t.toString())
                    }
                })
        }
    }

}