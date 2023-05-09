package cmsr.ipsacademy.net.activities.teacher.attendance.viewAttedanceModel

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import cmsr.ipsacademy.net.R


class NestedAdapter(private val mList: List<DataOfStudent>) :
    RecyclerView.Adapter<NestedAdapter.NestedViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NestedViewHolder {
        val view: View =
            LayoutInflater.from(parent.context).inflate(R.layout.nested_item, parent, false)
        return NestedViewHolder(view)
    }

    override fun onBindViewHolder(holder: NestedViewHolder, position: Int) {
        holder.mTv.text = mList[position].name
        holder.enroll.text = mList[position].enroll
        holder.attend.text = mList[position].attend

        if (mList[position].attend.equals("A")){
            holder.attend.setTextColor(Color.RED)
        }
    }

    override fun getItemCount(): Int {
        return mList.size
    }

    inner class NestedViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val mTv: TextView
        val enroll:TextView
        val attend:TextView

        init {
            mTv = itemView.findViewById(R.id.nestedItemTv)
            enroll = itemView.findViewById(R.id.nestedItemTvEnroll)
            attend = itemView.findViewById(R.id.nestedItemTvAttend)
        }
    }
}