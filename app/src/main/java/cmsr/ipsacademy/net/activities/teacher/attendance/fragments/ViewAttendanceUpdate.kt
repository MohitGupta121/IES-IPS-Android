package cmsr.ipsacademy.net.activities.teacher.attendance.fragments

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import cmsr.ipsacademy.net.activities.teacher.attendance.adapters.UpdateAttendanceStudentsListAdapter
import cmsr.ipsacademy.net.api.ApiSet
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentViewAttendanceUpdateBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ViewAttendanceUpdate : Fragment() {

    private lateinit var binding: FragmentViewAttendanceUpdateBinding
    private lateinit var myAdapter: UpdateAttendanceStudentsListAdapter

    private lateinit var attend_info: String
    private val studentList: ArrayList<String> = ArrayList()
    val presentStudentList: ArrayList<String> = ArrayList()
    val absentStudentList: ArrayList<String> = ArrayList()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val arguments = this.arguments
        if (arguments != null) {
            attend_info = arguments.getString("attend_info").toString()
            modifyAttendance(attend_info)
        }

        myAdapter = UpdateAttendanceStudentsListAdapter(requireContext(), this)

        setupRecyclerview()
        submitUpdateAttendance()

    }

    private fun submitUpdateAttendance() {

        binding.updateAttendanceSubmitButton.setOnClickListener {

            Log.e("present", presentStudentList.size.toString())

            lifecycleScope.launch(Dispatchers.IO) {

                var submitAction2 = false
                var submitAction3 = false

                if (presentStudentList.isNotEmpty()) {
                    for (i in 0 until presentStudentList.size) {
                        val comp = presentStudentList[i]

                        val res2 = controller.getInstance().create(ApiSet::class.java)
                            .updateStudentAttendance("1", attend_info, comp).execute()
                        if (res2.isSuccessful)
                            Log.e("updatePresent: ", res2.body().toString())
                        submitAction2 = true
                    }
                } else {
                    submitAction2 = true
                }

                if (absentStudentList.isNotEmpty()) {
                    for (i in 0 until absentStudentList.size) {
                        val comp = absentStudentList[i]

                        val res2 = controller.getInstance().create(ApiSet::class.java)
                            .updateStudentAttendance("0", attend_info, comp).execute()
                        if (res2.isSuccessful) {
                            Log.e("updatePresent: ", res2.body().toString())
                            submitAction2 = true
                        }

                    }
                } else {
                    submitAction3 = true
                }

                Log.e(
                    "action",
                    submitAction2.toString() + submitAction3.toString()
                )

                if (submitAction2 && submitAction3) {

                    withContext(Dispatchers.Main) {

                        Toast.makeText(
                            requireContext(),
                            "Attendance Updated",
                            Toast.LENGTH_LONG
                        ).show()

                    }
                }

            }

        }
    }

    private fun modifyAttendance(attend_info: String) {

//        binding.progressModifyAttendanceData.visibility = View.VISIBLE

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .updateViewAttendance(attend_info).execute()

            if (res.body() != null) {
                Log.d(
                    "SelectTopics",
                    "Topics-" + res.body()
                        .toString() + "\n"
                )

                withContext(Dispatchers.Main) {
                    myAdapter.setData(res.body()!!)
                    myAdapter.notifyDataSetChanged()
                    binding.updateAttendanceStudentsNameRecyclerview.adapter = myAdapter

                    for (i in 0 until res.body()!!.size) {
                        studentList.add(res.body()!![i].student_computer_code)

                    }

                }
            }
        }

    }

    private fun setupRecyclerview() {
        binding.updateAttendanceStudentsNameRecyclerview.layoutManager =
            LinearLayoutManager(requireContext())
    }

    companion object {
        fun newInstance() = ViewAttendanceUpdate()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val fragmentBinding =
            FragmentViewAttendanceUpdateBinding.inflate(inflater, container, false)
        binding = fragmentBinding
        return fragmentBinding.root
    }
}