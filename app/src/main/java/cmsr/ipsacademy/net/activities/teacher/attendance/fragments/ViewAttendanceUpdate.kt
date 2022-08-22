package cmsr.ipsacademy.net.activities.teacher.attendance.fragments

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.teacher.attendance.adapters.ModifyAttendanceAdapter
import cmsr.ipsacademy.net.activities.teacher.attendance.adapters.TakeAttendanceStudentsListAdapter
import cmsr.ipsacademy.net.activities.teacher.attendance.adapters.UpdateAttendanceStudentsListAdapter
import cmsr.ipsacademy.net.api.ApiSet
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentModifyAttendanceBinding
import cmsr.ipsacademy.net.databinding.FragmentViewAttendanceUpdateBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ViewAttendanceUpdate : Fragment() {

    private lateinit var binding: FragmentViewAttendanceUpdateBinding
    private lateinit var myAdapter: UpdateAttendanceStudentsListAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val arguments = this.arguments
        if (arguments != null) {
            val batch_id = arguments.getString("batch_id").toString()
            modifyAttendance(batch_id)
        }

        myAdapter = UpdateAttendanceStudentsListAdapter(requireContext())

        setupRecyclerview()

    }

    private fun modifyAttendance(batch_id: String) {

//        binding.progressModifyAttendanceData.visibility = View.VISIBLE

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .getStudentsByBatchId(batch_id, "2").execute()

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
                }
            }
        }

    }

    private fun setupRecyclerview() {
        binding.updateAttendanceStudentsNameRecyclerview.layoutManager = LinearLayoutManager(requireContext())
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