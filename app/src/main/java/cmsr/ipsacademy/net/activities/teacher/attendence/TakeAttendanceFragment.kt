package cmsr.ipsacademy.net.activities.teacher.attendence

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.api.ApiSet
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.databinding.FragmentTakeAttendanceBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class TakeAttendanceFragment : Fragment() {

    private lateinit var clg_sub_code: String
    private lateinit var binding: FragmentTakeAttendanceBinding


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val arguments = this.arguments
        if (arguments != null) {
            clg_sub_code = arguments.getString("clg_sub_code").toString()
        }

        getSelectTopics(clg_sub_code)

    }

    companion object {
        fun newInstance() = TakeAttendanceFragment()
    }

    private fun getSelectTopics(clg_sub_code: String) {

        lifecycleScope.launch(Dispatchers.IO) {
            val res = controller.getInstance().create(ApiSet::class.java)
                .getTopicFromBatchId(clg_sub_code).execute()

            if (res.body() != null) {
                Log.d(
                    "SelectTopics",
                    "Topics-" + res.body()
                        .toString() + "\n" + res.body()!![0].topic_name
                )

                withContext(Dispatchers.Main) {

                    val topicsItems: ArrayList<String> = ArrayList()

                    for (i in 0 until res.body()!!.size) {
                        topicsItems.add(res.body()!![0].topic_name)
                        setTopicSpinner(topicsItems)
                    }

                }
            }
        }

    }

    private fun setTopicSpinner(item: ArrayList<String>) {

        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, item)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.takeAttendanceSubjectTopicSpinner.adapter = adapter

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