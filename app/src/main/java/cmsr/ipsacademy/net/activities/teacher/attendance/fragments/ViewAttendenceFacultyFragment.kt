package cmsr.ipsacademy.net.activities.teacher.attendance.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.teacher.attendance.viewAttedanceModel.DataModel
import cmsr.ipsacademy.net.activities.teacher.attendance.viewAttedanceModel.DataOfStudent
import cmsr.ipsacademy.net.activities.teacher.attendance.viewAttedanceModel.ItemAdapter
import cmsr.ipsacademy.net.databinding.FragmentViewAttendenceFacultyBinding

class ViewAttendenceFacultyFragment : Fragment(R.layout.fragment_view_attendence_faculty) {
    private var recyclerView: RecyclerView? = null
    private var mList: MutableList<DataModel>? = null
    private var adapter: ItemAdapter? = null
    private lateinit var binding: FragmentViewAttendenceFacultyBinding

    companion object {
        fun newInstance() = ViewAttendenceFacultyFragment()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        recyclerView = requireView().findViewById(R.id.main_recyclervie) as RecyclerView
        recyclerView!!.layoutManager = LinearLayoutManager(requireContext())

        mList = mutableListOf()

        //list1


        for (i in 1..20){
            val nestedList1: MutableList<DataOfStudent> = ArrayList()
            var dataOfStudent3 = DataOfStudent("Mohit Gupta ${i}","0808CT21102${i}","P")
            nestedList1.add(dataOfStudent3)
            var dataOfStudent = DataOfStudent("ismail${i}","0808CL21102${i}","A")
            nestedList1.add(dataOfStudent)
            var dataOfStudent2 = DataOfStudent("sashank${i}","0808CS21102${i}","P")
            nestedList1.add(dataOfStudent2)
            var dataOfStudent4 = DataOfStudent("sashank${i}","0808CS21102${i}","P")
            nestedList1.add(dataOfStudent4)

            mList!!.add(DataModel(nestedList1, "${i.plus(10)}th july  9:15AM-10:30AM", time = ""))
        }


        adapter = ItemAdapter(mList!!)
        recyclerView!!.setAdapter(adapter)
    }

}