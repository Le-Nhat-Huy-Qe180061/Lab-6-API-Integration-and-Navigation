import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Container,
    Alert,
    Badge,
    Card,
    Form,
    InputGroup,
    Row,
    Col,
    Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Search,
    Plus,
    Pencil,
    Trash,
    CheckCircle,
    XCircle
} from 'react-bootstrap-icons';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                'https://student-api-nestjs.onrender.com/students'
            );
            const studentData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setStudents(studentData);
        } catch (err) {
            setError('Error fetching students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const showSuccessMessage = (message) => {
        setSuccess(message);
        setTimeout(() => {
            setSuccess(null);
        }, 1500);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(
                    `https://student-api-nestjs.onrender.com/students/${id}`
                );
                showSuccessMessage('Student deleted successfully!');
                await fetchStudents();
            } catch (err) {
                setError('Error deleting student');
            }
        }
    };

    const handleStatusUpdate = async (student) => {
        try {
            await axios.put(
                `https://student-api-nestjs.onrender.com/students/${student._id}`,
                {
                    name: student.name,
                    isActive: !student.isActive
                }
            );
            showSuccessMessage(
                `Student status updated to ${
                    !student.isActive ? 'Active' : 'Inactive'
                }!`
            );
            await fetchStudents();
        } catch (err) {
            setError('Error updating student status');
        }
    };

    const handleSort = (field) => {
        setSortDirection(
            sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
        );
        setSortField(field);
    };

    const filteredAndSortedStudents = students
        .filter(
            (student) =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentCode
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortDirection === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
            }
            return a[sortField] < b[sortField] ? 1 : -1;
        });

    if (loading)
        return (
            <div
                className='d-flex justify-content-center align-items-center'
                style={{ height: '100vh' }}
            >
                <Spinner animation='border' variant='primary' />
            </div>
        );

    return (
        <Container className='py-4'>
            {success && (
                <Alert
                    variant='success'
                    className='animate__animated animate__fadeIn'
                >
                    {success}
                </Alert>
            )}
            {error && (
                <Alert
                    variant='danger'
                    className='animate__animated animate__fadeIn'
                >
                    {error}
                </Alert>
            )}

            <Card className='shadow-sm'>
                <Card.Header className='bg-white'>
                    <Row className='align-items-center'>
                        <Col md={4}>
                            <h4 className='mb-0'>Student Management</h4>
                        </Col>
                        <Col md={5}>
                            <InputGroup>
                                <InputGroup.Text className='bg-white'>
                                    <Search />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder='Search by name or student code...'
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className='border-start-0'
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3} className='text-end'>
                            <Link to='/add-student'>
                                <Button
                                    variant='primary'
                                    className='d-flex align-items-center gap-2'
                                >
                                    <Plus size={20} />
                                    Add New Student
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className='p-0'>
                    {filteredAndSortedStudents.length === 0 ? (
                        <Alert variant='info' className='m-3'>
                            No students available
                        </Alert>
                    ) : (
                        <Table hover className='mb-0'>
                            <thead className='bg-light'>
                                <tr>
                                    <th
                                        onClick={() =>
                                            handleSort('studentCode')
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Student Code{' '}
                                        {sortField === 'studentCode' &&
                                            (sortDirection === 'asc'
                                                ? '↑'
                                                : '↓')}
                                    </th>
                                    <th
                                        onClick={() => handleSort('name')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Name{' '}
                                        {sortField === 'name' &&
                                            (sortDirection === 'asc'
                                                ? '↑'
                                                : '↓')}
                                    </th>
                                    <th>Status</th>
                                    <th className='text-end'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedStudents.map((student) => (
                                    <tr
                                        key={student.studentCode || student._id}
                                    >
                                        <td className='align-middle'>
                                            {student.studentCode}
                                        </td>
                                        <td className='align-middle'>
                                            <Link
                                                to={`/student/${student._id}`}
                                                className='text-decoration-none'
                                            >
                                                {student.name}
                                            </Link>
                                        </td>
                                        <td className='align-middle'>
                                            <Badge
                                                bg={
                                                    student.isActive
                                                        ? 'success'
                                                        : 'secondary'
                                                }
                                                className='d-inline-flex align-items-center gap-1 px-2 py-1'
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    handleStatusUpdate(student)
                                                }
                                            >
                                                {student.isActive ? (
                                                    <>
                                                        <CheckCircle
                                                            size={12}
                                                        />{' '}
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={12} />{' '}
                                                        Inactive
                                                    </>
                                                )}
                                            </Badge>
                                        </td>
                                        <td className='text-end'>
                                            <div className='d-flex gap-2 justify-content-end'>
                                                <Link
                                                    to={`/edit-student/${student._id}`}
                                                >
                                                    <Button
                                                        variant='outline-warning'
                                                        size='sm'
                                                        className='d-inline-flex align-items-center gap-1'
                                                    >
                                                        <Pencil size={14} />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant='outline-danger'
                                                    size='sm'
                                                    className='d-inline-flex align-items-center gap-1'
                                                    onClick={() =>
                                                        handleDelete(
                                                            student._id
                                                        )
                                                    }
                                                >
                                                    <Trash size={14} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentList;
