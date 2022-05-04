package cmsr.ipsacademy.net.activities.Teacher

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import cmsr.ipsacademy.net.activities.models.faculty.subjects.FacultySubjectsDetailsModelSubListItem
import cmsr.ipsacademy.net.adapters.AttendancePanelViewAdapter
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentAttendancePanelBinding
import cmsr.ipsacademy.net.helpers.AppConstants
import cmsr.ipsacademy.net.helpers.SharedPreferencesHelper
import kotlinx.android.synthetic.main.fragment_attendance_panel.*
import retrofit2.Call
import retrofit2.Response

/**
 * A simple [Fragment] subclass.
 * Use the [AttendancePanelFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class AttendancePanelFragment : Fragment() {

    private var binding: FragmentAttendancePanelBinding? = null
    private var sharedPreferencesHelper: SharedPreferencesHelper? = null
    lateinit var myAdapter: AttendancePanelViewAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sharedPreferencesHelper = SharedPreferencesHelper(requireContext())

        sharedPreferencesHelper?.getValueString(AppConstants.computer_code)
            ?.let { getSubjectsDetails(it) }

        setupRecyclerview()
    }

    private fun getSubjectsDetails(computer_code: String) {

        val userApi = controller.getInstance().create(apiset::class.java)

        userApi.getFacultySubjectsDetails(computer_code)
            .enqueue(object :
                retrofit2.Callback<List<List<FacultySubjectsDetailsModelSubListItem>>?> {
                override fun onResponse(
                    call: Call<List<List<FacultySubjectsDetailsModelSubListItem>>?>,
                    response: Response<List<List<FacultySubjectsDetailsModelSubListItem>>?>
                ) {
                    val responseBody = response.body()!!
                    val myStringBuilder = StringBuilder()
                    for (myData in responseBody){
                        myStringBuilder.append(myData.listIterator())
                        myStringBuilder.append("\n")
                    }
                    Log.d(
                        "mohitgu",
                        "Faculty Subjects-" + myStringBuilder
                    )
                    if (response.body() != null) {

//                        response.body()?.let { myAdapter.setData(it) }
//                        binding?.subject?.setText(response.body()!!.get(0).get(0).subject_name)
                        Log.d(
                            "test",
                            "Faculty Subjects-" + response.body()
                                .toString() + response.body()!!.size.toString()
                        )
                        myAdapter = AttendancePanelViewAdapter(requireContext())
                        myAdapter.setData(response.body()!!)
                        myAdapter.notifyDataSetChanged()
                        binding?.recyclerViewAttendancePanel!!.adapter = myAdapter

                    }
                }

                override fun onFailure(
                    call: Call<List<List<FacultySubjectsDetailsModelSubListItem>>?>,
                    t: Throwable
                ) {
                    Log.d("error", t.toString())
                }

            })

    }

    private fun setupRecyclerview() {
        binding?.recyclerViewAttendancePanel?.layoutManager = LinearLayoutManager(requireContext())
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