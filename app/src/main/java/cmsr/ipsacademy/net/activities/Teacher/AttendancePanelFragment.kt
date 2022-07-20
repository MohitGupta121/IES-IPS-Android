package cmsr.ipsacademy.net.activities.Teacher

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import cmsr.ipsacademy.net.activities.models.faculty.subjects.FacultySubjectDetailsModel
import cmsr.ipsacademy.net.adapters.AttendancePanelViewAdapter
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentAttendancePanelBinding
import cmsr.ipsacademy.net.helpers.AppConstants
import cmsr.ipsacademy.net.helpers.SharedPreferencesHelper
import kotlinx.android.synthetic.main.fragment_attendance_panel.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Call
import retrofit2.Response

class AttendancePanelFragment : Fragment() {

    private var binding: FragmentAttendancePanelBinding? = null
    private var sharedPreferencesHelper: SharedPreferencesHelper? = null
    private lateinit var myAdapter: AttendancePanelViewAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sharedPreferencesHelper = SharedPreferencesHelper(requireContext())

        sharedPreferencesHelper?.getValueString(AppConstants.computer_code)
            ?.let { getSubjectsDetails(it) }

        setupRecyclerview()
    }

    private fun getSubjectsDetails(computer_code: String) {

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(apiset::class.java)
                .getFacultySubjectsDetails(computer_code).execute()

            if (res.body() != null) {
                Log.d(
                    "test",
                    "Faculty Subjects-" + res.body()
                        .toString() + "\n" + res.body()!!.size.toString() + "\n" + res.body()!![0].department.toString()
                )
                withContext(Dispatchers.Main) {
                    myAdapter = AttendancePanelViewAdapter(requireContext())
                    myAdapter.setData(res.body()!!)
                    myAdapter.notifyDataSetChanged()
                    binding?.recyclerViewAttendancePanel!!.adapter = myAdapter
                }

            }
        }

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