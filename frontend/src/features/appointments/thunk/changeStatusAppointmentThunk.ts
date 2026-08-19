import { getErrorMessage } from "@/features/errors/getError";
import { appointmentsService } from "@/services/appointmentsService";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const changeStatusAppointmentThunk = createAsyncThunk(
  'appointment/status',
  async ({status, id}:{status:string,id:number}, thunkApi) => {
    try {
      return await appointmentsService.changeStatus( status, id)
    }
    catch(e) { return thunkApi.rejectWithValue(getErrorMessage(e))
    
    }
  }
) 