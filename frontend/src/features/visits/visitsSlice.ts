import type { Appointment } from "@/types/appointment";
import type { Visit } from "@/types/visit";
import { createSlice } from "@reduxjs/toolkit";
import { createVisitThunk } from "./thunks/createVisitThunk";
import { getVisitByAppointmentIdThunk } from "./thunks/getVisitsByAppointmentsId";
import { getVisits } from "./thunks/getVisitsThunk";

interface VisitsState {
  visits: Visit[] | [];
  currentVisits: Visit | null;
  isActiveVisits: boolean;
  selectedAppointment: Appointment | null;
  loading: boolean;

}
const initialState: VisitsState= {
  visits: [],
  currentVisits: null,
  isActiveVisits: false,
  selectedAppointment: null,
  loading:false,

}

const visitsSlice = createSlice({
  name: "visits",
  initialState,
  reducers: {},
  extraReducers:( builder) => {
    builder
      .addCase(createVisitThunk.pending, state => {
        state.loading = true
      })
      .addCase(createVisitThunk.fulfilled, (state) => {
        
        state.loading = false;
      })
      .addCase(createVisitThunk.rejected, state => {
         state.isActiveVisits = false;
        state.loading = false;
      }
       
    )
    .addCase(getVisitByAppointmentIdThunk.pending, state => {
        state.loading = true
      })
      .addCase(getVisitByAppointmentIdThunk.fulfilled, (state, action) => {
        
        state.currentVisits = action.payload;
        state.isActiveVisits = true
        state.loading = false;
      })
      .addCase(getVisitByAppointmentIdThunk.rejected, state => {
         state.isActiveVisits = false;
        state.loading = false;
      }
       
    )
     
      .addCase(getVisits.pending, state => {
        state.loading = true
      })
      .addCase(getVisits.fulfilled, (state, action) => {
        
        state.visits = action.payload;
        
        state.loading = false;
      })
      .addCase(getVisits.rejected, state => {
       
        state.loading = false;
      }
       
    )
   
  }
  
})
export default visitsSlice.reducer