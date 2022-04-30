package cmsr.ipsacademy.net.activities.Teacher

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.models.faculty.subjects.FacultySubjectsDetailsModel
import cmsr.ipsacademy.net.activities.models.student.StudentInfoModel
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.ActivityMainBinding
import cmsr.ipsacademy.net.databinding.FragmentAttendancePanelBinding
import cmsr.ipsacademy.net.helpers.AppConstants
import cmsr.ipsacademy.net.helpers.SharedPreferencesHelper
import retrofit2.Call
import retrofit2.Response

/**
 * A simple [Fragment] subclass.
 * Use the [AttendancePanelFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class AttendancePanelFragment : Fragment() {

    private var binding : FragmentAttendancePanelBinding? = null
    private var sharedPreferencesHelper: SharedPreferencesHelper? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sharedPreferencesHelper = SharedPreferencesHelper(requireContext())

        sharedPreferencesHelper?.getValueString(AppConstants.computer_code)
            ?.let { getSubjectsDetails(it) }
    }

    private fun getSubjectsDetails(computer_code: String) {

        val userApi = controller.getInstance().create(apiset::class.java)

        userApi.getFacultySubjectsDetails(computer_code)
            .enqueue(object : retrofit2.Callback<FacultySubjectsDetailsModel> {
                override fun onResponse(
                    call: Call<FacultySubjectsDetailsModel>,
                    response: Response<FacultySubjectsDetailsModel>
                ) {
                    if (response.body() != null) {
                        binding?.subject?.setText(response.body()!!.get(0).get(0).subject_name)
                        Log.d(
                            "subjects",
                            "Faculty Subjects-" + response.body().toString()
                        )
                    }
                }
                override fun onFailure(call: Call<FacultySubjectsDetailsModel>, t: Throwable) {
                    Log.d("error", t.toString())
                }
            })
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val fragmentBinding = FragmentAttendancePanelBinding.inflate(inflater, container, false)
        binding = fragmentBinding
        return fragmentBinding.root
    }
}