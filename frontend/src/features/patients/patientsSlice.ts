import type { Patient } from "@/types/patient";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createPatientThunk } from "./thunk/createPatientThunk";
import { getAllPatientThunk } from "./thunk/getAllPacientThunk";
import { getPatientByIdThunk } from "./thunk/getPatientByIdThunk";
import { updatePatientThunk } from "./thunk/updatePatientThunk";
import { removePatientThunk } from "./thunk/removePatientThunk";
import type { PatientQuery } from "./model/patientsQuery";
import { getStatisticPatient } from "./thunk/getStatisticPatient";


interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;

  loading: boolean;
  error: string | null;

  total: number;
  query:PatientQuery
statistic:[]
  
}
const initialState: PatientsState = {
  patients: [],
  selectedPatient: null,
  total: 0,
  loading: false,
  error: null,
  query:{
    search: "",
     sortBy: "name",
    sortOrder: "asc",
    page: 1,
    pageSize: 5,   
  },
  statistic:[]
  
}

const patientsSlice = createSlice({
  name: "patient",
  initialState,
 reducers: {
    setQuery(state, action: PayloadAction<Partial<PatientQuery>>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },

    resetQuery(state) {
      state.query = initialState.query;
    },

    setSelectedPatient(state, action: PayloadAction<Patient | null>) {
      state.selectedPatient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
         .addCase(getStatisticPatient.pending, (state) => {
        state.loading = true
      })
     .addCase(getStatisticPatient.fulfilled, (state, action) => {
       state.loading = false
       state.statistic = action.payload
       console.log(action.payload)
     })
     .addCase(getStatisticPatient.rejected, (state) => {
        state.loading = false
      })
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
        state.total = action.payload.total
        console.log(action.payload, "payload patiernt")
        
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
          }) 
   
  }
   
})
export const { setQuery, resetQuery, setSelectedPatient } = patientsSlice.actions;
export default patientsSlice.reducer;