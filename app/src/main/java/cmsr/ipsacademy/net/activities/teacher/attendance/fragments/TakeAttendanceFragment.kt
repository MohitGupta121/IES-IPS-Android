package cmsr.ipsacademy.net.activities.teacher.attendance.fragments

import android.app.DatePickerDialog
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.View.GONE
import android.view.View.VISIBLE
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.teacher.attendance.adapters.TakeAttendanceStudentsListAdapter
import cmsr.ipsacademy.net.api.ApiSet
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentTakeAttendanceBinding
import cmsr.ipsacademy.net.helpers.AppConstants
import cmsr.ipsacademy.net.helpers.SharedPreferencesHelper
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.*
import kotlin.collections.ArrayList

class TakeAttendanceFragment : Fragment() {

    private lateinit var clg_sub_code: String
    private lateinit var batch_id: String
    private lateinit var semester: String
    private lateinit var binding: FragmentTakeAttendanceBinding
    private lateinit var myAdapter: TakeAttendanceStudentsListAdapter
    private lateinit var sharedPreferencesHelper: SharedPreferencesHelper
    private lateinit var faculty_computer_code: String
    private lateinit var date: String
    private lateinit var lecture_type: String
    private lateinit var time_slot_id: String
    private lateinit var topic_id: String
    private lateinit var lab_group: String
    private val studentList: ArrayList<String> = ArrayList()
    val presentStudentList: ArrayList<String> = ArrayList()
    private val absentStudentList: ArrayList<String> = ArrayList()

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        myAdapter = TakeAttendanceStudentsListAdapter(requireContext(), this)

        sharedPreferencesHelper = SharedPreferencesHelper(requireContext())
        sharedPreferencesHelper.getValueString(AppConstants.computer_code)
            ?.let { faculty_computer_code = it }

        val arguments = this.arguments
        if (arguments != null) {
            clg_sub_code = arguments.getString("clg_sub_code").toString()
            batch_id = arguments.getString("batch_id").toString()
            semester = arguments.getString("semester").toString()
        }

        getSelectTopics()
        getLectureCategory()
        selectToadyDate()
        getAllStudents()
        setupStudentsDetailsRecyclerView()
        selectAllStudents()
        submitAttendance()

    }


    private fun submitAttendance() {

        var latest_record_id: String = "7854"

        binding.takeAttendanceSubmitButton.setOnClickListener {

//            Log.e("present", presentStudentList.size.toString())
//
//            println(studentList.minus(presentStudentList.toSet()))
//
            absentStudentList.addAll(studentList.minus(presentStudentList.toSet()))
//            println("Absent:   " + absentStudentList.toSet())

            binding.progressSubmitAttendance.visibility = VISIBLE

            lifecycleScope.launch(Dispatchers.IO) {

                var submitAction1 = false
                var submitAction2 = false
                var submitAction3 = false

                val res = controller.getInstance().create(ApiSet::class.java)
                    .submitAttendance(
                        batch_id,
                        faculty_computer_code,
                        date,
                        lecture_type,
                        time_slot_id,
                        topic_id,
                        "AB",
                        "192.APP.IP"
                    ).execute()

                if (res.isSuccessful) {

                    Log.d(
                        "SUBMIT",
                        res.body()
                            .toString()
                    )

                    submitAction1 = true

                    withContext(Dispatchers.Main) {
                        latest_record_id = res.body()!!.latest_id
                    }
                }

                Log.e(
                    "students",
                    "present:" + presentStudentList.size + "absent: " + absentStudentList.size
                )

                if (presentStudentList.isNotEmpty()) {
                    for (i in 0 until presentStudentList.size) {
                        val comp = presentStudentList[i]
                        Log.e("present", comp + latest_record_id)
                        val res2 = controller.getInstance().create(ApiSet::class.java)
                            .presentStudent(comp, latest_record_id, "1").execute()
                        if (res2.isSuccessful)
                            submitAction2 = true
                    }
                } else {
                    submitAction2 = true
                }

                if (absentStudentList.isNotEmpty()) {
                    for (i in 0 until absentStudentList.size) {
                        val comp = absentStudentList[i]
                        Log.e("absent", comp + latest_record_id)
                        val res3 = controller.getInstance().create(ApiSet::class.java)
                            .presentStudent(comp, latest_record_id, "0").execute()
                        if (res3.isSuccessful)
                            submitAction3 = true
                    }
                } else {
                    submitAction3 = true
                }

                Log.e(
                    "action",
                    submitAction1.toString() + submitAction2.toString() + submitAction3.toString()
                )

                if (submitAction1 && submitAction2 && submitAction3) {

                    val res3 = controller.getInstance().create(ApiSet::class.java)
                        .modifyAttendance(batch_id).execute()
                    if (res3.isSuccessful) {
                        Log.d(
                            "MODIFY",
                            res3.body()
                                .toString()
                        )
                    }

                    withContext(Dispatchers.Main) {

                        binding.progressSubmitAttendance.visibility = GONE

                        Toast.makeText(
                            requireContext(),
                            "Modify Attendance + ${batch_id}",
                            Toast.LENGTH_SHORT
                        ).show()

                        openModifyAttendance(batch_id)

                    }
                }

            }

        }

    }

    private fun openModifyAttendance(batchId: String) {
        val fragment: ModifyAttendanceFragment = ModifyAttendanceFragment.newInstance()
        val bundle = Bundle()
        bundle.putString("batch_id", batchId)
        fragment.arguments = bundle
        requireActivity().supportFragmentManager.beginTransaction()
            .replace(R.id.frame_layout_container, fragment).addToBackStack(null).commit()
    }

    private fun selectAllStudents() {

        binding.takeAttendanceSelectAllStudent.setOnClickListener {

            val attendCheckBox = it as CheckBox

            if (attendCheckBox.isChecked) {
                myAdapter.selectAllStudent = true
                myAdapter.notifyDataSetChanged()
                presentStudentList.addAll(studentList)

            } else if (!attendCheckBox.isChecked) {
                myAdapter.selectAllStudent = false
                myAdapter.notifyDataSetChanged()
                presentStudentList.removeAll(studentList.toSet())
            }
        }

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
                    myAdapter.setData(res.body()!!)
                    myAdapter.notifyDataSetChanged()
                    binding.takeAttendanceStudentsNameRecyclerview.adapter = myAdapter

                    for (i in 0 until res.body()!!.size) {
                        studentList.add(res.body()!![i].computer_code)

                    }
                }
            }
        }
    }

    private fun setupStudentsDetailsRecyclerView() {
        binding.takeAttendanceStudentsNameRecyclerview.layoutManager =
            LinearLayoutManager(requireContext())
//        myAdapter.setOnClickListener(object :
//            TakeAttendanceStudentsListAdapter.onItemClickListener {
//            override fun onItemClick(position: Int) {
//                presentStudentList.add(studentList[position])
//            }
//
//        })
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
                        ("$year-${monthOfYear.plus(1)}-$dayOfMonth")
                    date = binding.takeAttendanceSelectDateSpinner.text as String
                },
                year,
                month,
                day
            )
            dpd.show()
        }

    }

    private fun setStudentGroup(pos: Int) {

        val groupItems: ArrayList<String> = ArrayList()

        if (pos == 1) {
            groupItems.add("A")
            groupItems.add("B")
        } else {
            groupItems.add("Both A & B")
        }

        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, groupItems)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSelectGroupSpinner.adapter = adapter

    }

    /**
     * Get TimeSlot from API
     *
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

     **/

    private fun setTimeSlotSpinner(lect_type: Int) {

        val timeItem: ArrayList<String> = ArrayList()

        if (lect_type == 1) {
            timeItem.add("09:45 AM - 10:35 AM")
            timeItem.add("10:35 AM - 11:25 AM")
            timeItem.add("11:25 AM - 12:20 PM")
            timeItem.add("12:20 PM - 01:10 PM")
            timeItem.add("01:40 PM - 02:30 PM")
            timeItem.add("02:30 PM - 03:20 PM")
            timeItem.add("03:20 PM - 04:05 PM")
            timeItem.add("04:05 PM - 04:50 PM")
        }
//        else if (lect_type==2){
//            timeItem.add("09:45 AM - 11:25 AM")
//            timeItem.add("10:35 AM - 12:20 PM")
//            timeItem.add("12:20 PM - 02:30 PM")
//            timeItem.add("02:30 PM - 04:05 PM")
//            timeItem.add("03:20 PM - 04:50 PM")
//        } else if (lect_type==4){
//            timeItem.add("09:45 AM - 01:10 AM")
//            timeItem.add("10:35 PM - 04:50 PM")
//        }

        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, timeItem)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSelectTimeSlotsSpinner.adapter = adapter

        binding.takeAttendanceSelectTimeSlotsSpinner.onItemSelectedListener =
            object : AdapterView.OnItemSelectedListener {
                override fun onNothingSelected(parent: AdapterView<*>?) {
                }

                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    time_slot_id = (position + 1).toString()
                }
            }

    }

    /**
     * Lecture Type from API
     *

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

     */


    private fun getLectureCategory() {

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .getLectureCategory(clg_sub_code).execute()

            if (res.body() != null) {
                Log.d(
                    "TTTTTTT",
                    "Topics-" + res.body()
                        .toString() + "\n" + res.body()!![0].type
                )


                withContext(Dispatchers.Main) {
                    setLectureTypeSpinner(res.body()!![0].type)
                }


            }
        }

    }

    private fun setLectureTypeSpinner(lect_cat: String) {

        val lectureItems: ArrayList<String> = ArrayList()

        if (lect_cat == "B") {
            lectureItems.add("Theory")
            lectureItems.add("Tutorial")
            lectureItems.add("CBS")
            lectureItems.add("MST")
            lectureItems.add("Practical")
        } else if (lect_cat == "T") {
            lectureItems.add("Theory")
            lectureItems.add("Tutorial")
            lectureItems.add("CBS")
            lectureItems.add("MST")
        } else {
            lectureItems.add("Practical")
        }

        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, lectureItems)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSelectLectureTypeSpinner.adapter = adapter

        binding.takeAttendanceSelectLectureTypeSpinner.onItemSelectedListener =
            object : AdapterView.OnItemSelectedListener {
                override fun onNothingSelected(parent: AdapterView<*>?) {
                }

                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    if (lectureItems[position].contentEquals("Practical")) {
                        setStudentGroup(1)
                    } else {
                        setStudentGroup(0)
                    }

                    if (lectureItems[position].contentEquals("Theory") || lectureItems[position].contentEquals(
                            "CBS"
                        )
                    ) {
                        setTimeSlotSpinner(1)
                    } else if (lectureItems[position].contentEquals("Tutorial") || lectureItems[position].contentEquals(
                            "Practical"
                        )
                    ) {
                        setTimeSlotSpinner(2)
                    } else {
                        setTimeSlotSpinner(4)
                    }

                    lecture_type = (position + 1).toString()
                }
            }
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

                    val topicsName: ArrayList<String> = ArrayList()
                    val topicsID: ArrayList<String> = ArrayList()

                    for (i in 0 until res.body()!!.size) {
                        topicsName.add(res.body()!![i].topic_name)
                        topicsID.add(res.body()!![i].topic_id)
                        setTopicSpinner(topicsName, topicsID)
                    }
                }

            } else {
                val topicsItems: ArrayList<String> = ArrayList()
                val topicsID: ArrayList<String> = ArrayList()
                topicsItems.add(" ")
                topicsID.add(" ")
                setTopicSpinner(topicsItems, topicsID)
            }
        }

    }

    private fun setTopicSpinner(topicItem: ArrayList<String>, topicsID: ArrayList<String>) {

        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, topicItem)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

        binding.takeAttendanceSubjectTopicSpinner.adapter = adapter

        binding.takeAttendanceSubjectTopicSpinner.onItemSelectedListener =
            object : AdapterView.OnItemSelectedListener {
                override fun onNothingSelected(parent: AdapterView<*>?) {
                }

                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    topic_id = topicsID[position]
                }
            }

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