package cmsr.ipsacademy.net.activities.teacher.attendance.adapters

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.RecyclerView
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.teacher.attendance.fragments.ModifyAttendanceFragment
import cmsr.ipsacademy.net.activities.teacher.attendance.fragments.ViewAttendanceUpdate
import cmsr.ipsacademy.net.activities.teacher.attendance.models.modify_attendance.ModifyAttendanceItem
import kotlinx.android.synthetic.main.attendance_panel_table_list.view.txtSubject
import kotlinx.android.synthetic.main.modify_attendance_rv_item.view.*

class ModifyAttendanceAdapter(val context: Context) :
    RecyclerView.Adapter<ModifyAttendanceAdapter.ViewHolder>() {


    lateinit var myList: List<ModifyAttendanceItem>


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.modify_attendance_rv_item, parent, false)
        return ViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val rowPos = holder.adapterPosition

        val modal = myList[position]

        holder.itemView.apply {

            txtSubject.text = modal.subject_name
            txtBatch.text = modal.batch
            txtTopic.text = modal.topic_name
            txtLabGroup.text = modal.lab_group
            txtPresent.text = modal.total_present
            txtDate.text = modal.date
            txtTime.text = modal.time_slot
            txtLecture.text = modal.lecture
        }

        holder.itemView.modify_attendance_particular_subject_button.setOnClickListener {
            val fragment: ViewAttendanceUpdate = ViewAttendanceUpdate.newInstance()
            val activity = it.context as AppCompatActivity
            val bundle = Bundle()
            bundle.putString("batch_id", modal.batch_id)
            fragment.arguments = bundle
            activity.supportFragmentManager.beginTransaction()
                .replace(R.id.frame_layout_container, fragment).addToBackStack(null).commit()
        }
    }

    fun setData(newList: List<ModifyAttendanceItem>) {
        myList = newList
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {

        return myList.size // one more to add header row
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}