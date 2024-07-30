import dayjs from "dayjs";
import prisma from "../client";

export type leaveTypes = 'cl' | 'el' | 'dl' | 'ol' | 'lwp' | 'sdl';

export const remainingLeaves = async (computer_code:number , leave_type:leaveTypes , academic_session:number)=>{
    let leaveData  = await prisma.lms.findFirstOrThrow({
        where:{
          faculty_computer_code : computer_code,
          academic_session,
        }});

        return leaveData[leave_type];
}

export const genLmsApplyId = async( computer_code : number)=>{
    let deptNo = await prisma.faculty_info.findFirstOrThrow({where:{computer_code},select:{department:true}})
    let department = await prisma.department.findFirstOrThrow({where:{id:deptNo.department} , select:{dept_code:true}});
    let apply_id = `${dayjs().format('YYYYMMDDHHmmss')}${department.dept_code}`;
    return apply_id;
}