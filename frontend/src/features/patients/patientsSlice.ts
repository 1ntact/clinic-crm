import type { Patient } from "@/types/patient";
import { createSlice } from "@reduxjs/toolkit";
import { createPatientThunk } from "./thunk/createPatientThunk";
import { getAllPatientThunk } from "./thunk/getAllPacientThunk";
import { getPatientByIdThunk } from "./thunk/getPatientByIdThunk";
import { updatePatientThunk } from "./thunk/updatePatientThunk";
import { removePatientThunk } from "./thunk/removePatientThunk";

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;

  loading: boolean;
  error: string | null;

  total: number;

  
}
const initialState: PatientsState = {
  patients: [],
  selectedPatient: null,
  total: 0,
  loading: false,
  error:null,
  
}

const patientsSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {

    
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPatientThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPatientThunk.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createPatientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'failed to create patient'
      })
      .addCase(getAllPatientThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPatientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.items
        
      })
      .addCase(getAllPatientThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getPatientByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPatient = action.payload;
        console.log(action.payload)
      })
      .addCase(getPatientByIdThunk.rejected, (state) => {
  state.loading = false
      })
    .addCase(updatePatientThunk.pending, (state) => {
            state.loading = true;
          })
          .addCase(updatePatientThunk.fulfilled, (state, action) => {
            state.loading = false;
            
            state.selectedPatient = action.payload;
          })
          .addCase(updatePatientThunk.rejected, (state) => {
            state.loading = false;
          })
          .addCase(removePatientThunk.pending, state => {
            state.loading = true;
          })
        
      .addCase(removePatientThunk.fulfilled, (state, action) => {
           state.loading = false;
    
            state.patients = state.patients.filter(
            patient => patient.id !== action.payload
      );
    
      if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
      }
        })
          .addCase(removePatientThunk.rejected, state => {
            state.loading = false;
          });
    
  }
})
export default patientsSlice.reducer;