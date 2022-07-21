package cmsr.ipsacademy.net.activities.teacher.attendence

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import cmsr.ipsacademy.net.R

class TakeAttendanceFragment : Fragment(R.layout.fragment_take_attendance) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }

    companion object {
        fun newInstance() = TakeAttendanceFragment()
    }
}