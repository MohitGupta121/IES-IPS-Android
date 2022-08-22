package cmsr.ipsacademy.net.activities.teacher.attendance

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.View.GONE
import android.view.View.VISIBLE
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import cmsr.ipsacademy.net.activities.teacher.attendance.adapters.AttendancePanelViewAdapter
import cmsr.ipsacademy.net.activities.teacher.attendance.adapters.ModifyAttendanceAdapter
import cmsr.ipsacademy.net.api.ApiSet
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentModifyAttendanceBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ModifyAttendanceFragment : Fragment() {

    private lateinit var binding: FragmentModifyAttendanceBinding
    private lateinit var myAdapter: ModifyAttendanceAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val arguments = this.arguments
        if (arguments != null) {
            val batch_id = arguments.getString("batch_id").toString()
            modifyAttendance(batch_id)
        }

        setupRecyclerview()

    }

    private fun modifyAttendance(batch_id: String) {

        binding.progressModifyAttendanceData.visibility = VISIBLE

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .modifyAttendance(batch_id).execute()

            if (res.isSuccessful) {
                Log.d(
                    "MODIFY",
                    res.body()
                        .toString()
                )

                withContext(Dispatchers.Main) {
                    binding.progressModifyAttendanceData.visibility = GONE

                    myAdapter = ModifyAttendanceAdapter(requireContext())
                    myAdapter.setData(res.body()!!)
                    myAdapter.notifyDataSetChanged()
                    binding.recyclerViewModifyAttendance.adapter = myAdapter
                }

            }
        }

    }

    private fun setupRecyclerview() {
        binding.recyclerViewModifyAttendance.layoutManager = LinearLayoutManager(requireContext())
    }

    companion object {
        fun newInstance() = ModifyAttendanceFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val fragmentBinding =
            FragmentModifyAttendanceBinding.inflate(inflater, container, false)
        binding = fragmentBinding
        return fragmentBinding.root
    }
}