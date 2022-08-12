package cmsr.ipsacademy.net.activities.teacher.attendence.adapters

import android.content.Context
import androidx.recyclerview.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.teacher.attendence.models.students_by_batch_id.StudentByBatchIdItem
import kotlinx.android.synthetic.main.attendance_panel_table_list.view.txtBatch
import kotlinx.android.synthetic.main.attendance_student_table_list.view.*

class TakeAttendanceStudentsListAdapter(val context: Context) :
    RecyclerView.Adapter<TakeAttendanceStudentsListAdapter.RowViewHolder>() {

    private lateinit var myList: List<StudentByBatchIdItem>
    private lateinit var mlistener: onItemClickListener

    interface onItemClickListener {
        fun onItemClick(position: Int)
    }

    fun setOnClickListener(listener: onItemClickListener){
        mlistener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RowViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.attendance_student_table_list, parent, false)
        return RowViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: RowViewHolder, position: Int) {
        val rowPos = holder.adapterPosition

        val modal = myList[position]

        holder.itemView.apply {
            txtSNo.text = (holder.adapterPosition + 1).toString()
            txtBatch.text = modal.student_name
        }

        holder.itemView.txtBatch.setOnClickListener {
               mlistener.onItemClick(holder.adapterPosition)
        }

    }

    fun setData(newList: List<StudentByBatchIdItem>) {
        myList = newList
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {
        return myList.size
    }

    inner class RowViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}