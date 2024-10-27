import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentList from './Components/StudentList';
import StudentDetail from './Components/StudentDetail';
import StudentForm from './Components/StudentForm';

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path='/' element={<StudentList />} />
                    <Route path='/student/:id' element={<StudentDetail />} />
                    <Route
                        path='/add-student'
                        element={<StudentForm mode='add' />}
                    />
                    <Route
                        path='/edit-student/:id'
                        element={<StudentForm mode='edit' />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
