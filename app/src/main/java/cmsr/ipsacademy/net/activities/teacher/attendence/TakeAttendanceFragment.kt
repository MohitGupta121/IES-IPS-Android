package cmsr.ipsacademy.net.activities.teacher.attendence

import android.app.DatePickerDialog
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.DatePicker
import androidx.annotation.RequiresApi
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import cmsr.ipsacademy.net.activities.teacher.attendence.adapters.AttendancePanelViewAdapter
import cmsr.ipsacademy.net.activities.teacher.attendence.adapters.TakeAttendanceStudentsListAdapter
import cmsr.ipsacademy.net.api.ApiSet
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentTakeAttendanceBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.*
import javax.xml.datatype.DatatypeConstants.MONTHS
import kotlin.collections.ArrayList

class TakeAttendanceFragment : Fragment() {

    private lateinit var clg_sub_code: String
    private lateinit var batch_id: String
    private lateinit var semester: String
    private lateinit var binding: FragmentTakeAttendanceBinding
    private lateinit var myAdapter: TakeAttendanceStudentsListAdapter


    @RequiresApi(Build.VERSION_CODES.N)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val arguments = this.arguments
        if (arguments != null) {
            clg_sub_code = arguments.getString("clg_sub_code").toString()
            batch_id = arguments.getString("batch_id").toString()
            semester = arguments.getString("semester").toString()
        }

        getSelectTopics()
        getLectureType()
        getTimeSlots()
        setStudentGroup()
        selectToadyDate()
        getAllStudents()
        setupStudentsDetailsRecyclerView()

    }

    private fun getAllStudents() {
        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .getStudentsByBatchId(batch_id, semester).execute()

            if (res.body() != null) {
                Log.d(
                    "SelectTopics",
                    "Topics-" + res.body()
                        .toString() + "\n"
                )

                withContext(Dispatchers.Main) {
                    myAdapter = TakeAttendanceStudentsListAdapter(requireContext())
                    myAdapter.setData(res.body()!!)
                    myAdapter.notifyDataSetChanged()
                    binding.takeAttendanceStudentsNameRecyclerview.adapter = myAdapter
                }
            }
        }
    }

    private fun setupStudentsDetailsRecyclerView() {
        binding.takeAttendanceStudentsNameRecyclerview.layoutManager =
            LinearLayoutManager(requireContext())
    }

    @RequiresApi(Build.VERSION_CODES.N)
    private fun selectToadyDate() {
        binding.takeAttendanceSelectDateSpinner.setOnClickListener {

            val c = Calendar.getInstance()
            val year = c.get(Calendar.YEAR)
            val month = c.get(Calendar.MONTH)
            val day = c.get(Calendar.DAY_OF_MONTH)

            val dpd = DatePickerDialog(
                requireContext(),
                { _, year, monthOfYear, dayOfMonth ->
                    binding.takeAttendanceSelectDateSpinner.text =
                        ("$dayOfMonth - $monthOfYear - $year")
                },
                year,
                month,
                day
            )
            dpd.show()
        }
    }

    private fun setStudentGroup() {

        val groupItems: ArrayList<String> = ArrayList()
        groupItems.add("Both A & B")
        groupItems.add("A")
        groupItems.add("B")

        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, groupItems)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSelectGroupSpinner.adapter = adapter

    }

    private fun getTimeSlots() {

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .getTimeSlots().execute()

            if (res.body() != null) {
                Log.d(
                    "SelectTopics",
                    "Topics-" + res.body()
                        .toString() + "\n"
                )

                withContext(Dispatchers.Main) {

                    val lectureItems: ArrayList<String> = ArrayList()

                    for (i in 0 until res.body()!!.size) {
                        lectureItems.add(res.body()!![i].start_time + " - " + res.body()!![i].end_time)
                        setTimeSlotSpinner(lectureItems)
                    }

                }
            }
        }

    }

    private fun setTimeSlotSpinner(timeItem: java.util.ArrayList<String>) {
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, timeItem)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSelectTimeSlotsSpinner.adapter = adapter
    }

    private fun getLectureType() {

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .getLectureTypes().execute()

            if (res.body() != null) {
                Log.d(
                    "SelectTopics",
                    "Topics-" + res.body()
                        .toString() + "\n" + res.body()!![0].lecture_type
                )

                withContext(Dispatchers.Main) {

                    val lectureItems: ArrayList<String> = ArrayList()

                    for (i in 0 until res.body()!!.size) {
                        lectureItems.add(res.body()!![i].lecture_type)
                        setLectureTypeSpinner(lectureItems)
                    }

                }
            }
        }

    }

    private fun setLectureTypeSpinner(lectureItems: ArrayList<String>) {
        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, lectureItems)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSelectLectureTypeSpinner.adapter = adapter
    }

    private fun getSelectTopics() {

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .getTopicFromBatchId(clg_sub_code).execute()

            if (res.body() != null) {
                Log.d(
                    "SelectTopics",
                    "Topics-" + res.body()
                        .toString() + "\n"
                )

                withContext(Dispatchers.Main) {

                    val topicsItems: ArrayList<String> = ArrayList()
                    for (i in 0 until res.body()!!.size) {
                        topicsItems.add(res.body()!![i].topic_name)
                        setTopicSpinner(topicsItems)
                    }
                }

            }else {
                val topicsItems: ArrayList<String> = ArrayList()
                topicsItems.add(" ")
                setTopicSpinner(topicsItems)
            }
        }

    }

    private fun setTopicSpinner(topicItem: ArrayList<String>) {

        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, topicItem)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSubjectTopicSpinner.adapter = adapter

    }

    companion object {
        fun newInstance() = TakeAttendanceFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val fragmentBinding = FragmentTakeAttendanceBinding.inflate(inflater, container, false)
        binding = fragmentBinding
        return fragmentBinding.root
    }

}