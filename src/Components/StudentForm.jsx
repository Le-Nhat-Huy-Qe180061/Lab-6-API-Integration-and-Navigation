import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Button,
    Container,
    Alert,
    Form,
    Card,
    Row,
    Col,
    Spinner,
    InputGroup
} from 'react-bootstrap';
import {
    PersonFill,
    CodeSquare,
    CheckCircleFill,
    Save
} from 'react-bootstrap-icons';

const StudentForm = ({ mode = 'add' }) => {
    const [formData, setFormData] = useState({
        studentCode: '',
        name: '',
        isActive: true
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        if (mode === 'edit' && id) {
            fetchStudentData();
        }
    }, [mode]);

    // Get List Student
    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://student-api-nestjs.onrender.com/students/${id}`
            );
            setFormData(response.data.data);
        } catch (err) {
            setError('Error fetching student data');
        } finally {
            setLoading(false);
        }
    };

    // Validation
    const validateForm = () => {
        if (mode === 'add' && !formData.studentCode.trim()) {
            setError('Student Code is required');
            return false;
        }
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (mode === 'add' && formData.studentCode.length < 3) {
            setError('Student Code must be at least 3 characters');
            return false;
        }
        if (formData.name.length < 2) {
            setError('Name must be at least 2 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            if (mode === 'edit') {
                //Edit Student
                await axios.put(
                    `https://student-api-nestjs.onrender.com/students/${id}`,
                    {
                        name: formData.name,
                        isActive: formData.isActive
                    }
                );
                showSuccessMessage('Student updated successfully!');
            } // Add Student
            else {
                await axios.post(
                    'https://student-api-nestjs.onrender.com/students',
                    formData
                );
                showSuccessMessage('Student created successfully!');
            }

            // setTimeout(() => {
            //     navigate('/');
            // }, 1500);
        } catch (err) {
            console.error('Error details:', err.response || err.message);
            setError(
                `Error ${mode === 'edit' ? 'updating' : 'creating'} student: ${
                    err.response?.data?.message ||
                    err.message ||
                    'Unknown error'
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    // Thời gian thông báo hiện
    const showSuccessMessage = (message) => {
        setSuccess(message);
        setTimeout(() => {
            setSuccess(null);
        }, 1500);
    };

    const handleChange = (e) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
        setError(null);
    };

    // loading chờ cập nhập vào data
    if (loading && mode === 'edit') {
        return (
            <Container
                className='d-flex justify-content-center align-items-center'
                style={{ minHeight: '50vh' }}
            >
                <Spinner animation='border' variant='primary' />
            </Container>
        );
    }

    return (
        <Container className='py-4'>
            <Card className='shadow-sm'>
                <Card.Header className='bg-white py-3'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 className='mb-0'>
                            {mode === 'edit'
                                ? 'Edit Student'
                                : 'Add New Student'}
                        </h4>
                        <Link to='/' className='text-decoration-none'>
                            <Button
                                variant='outline-secondary'
                                className='rounded-pill shadow-sm'
                            >
                                Back to list student
                            </Button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body className='p-4'>
                    {/* Thông báo lỗi  */}
                    {error && (
                        <Alert
                            variant='danger'
                            className='animate__animated animate__fadeIn'
                        >
                            {error}
                        </Alert>
                    )}
                    {/* Thông báo thành công  */}
                    {success && (
                        <Alert
                            variant='success'
                            className='animate__animated animate__fadeIn'
                        >
                            {success}
                        </Alert>
                    )}

                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <Row>
                            {mode === 'add' && (
                                <Col md={6}>
                                    <Form.Group className='mb-4'>
                                        <Form.Label>Student Code</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className='bg-light'>
                                                <CodeSquare />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type='text'
                                                name='studentCode'
                                                value={formData.studentCode}
                                                onChange={handleChange}
                                                required
                                                minLength={3}
                                                placeholder='Enter student code'
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                Please enter a valid student
                                                code (min. 3 characters)
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            )}
                            <Col md={mode === 'add' ? 6 : 12}>
                                <Form.Group className='mb-4'>
                                    <Form.Label>Name</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className='bg-light'>
                                            <PersonFill />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type='text'
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            minLength={2}
                                            placeholder='Enter student name'
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            Please enter a valid name (min. 2
                                            characters)
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className='mb-4'>
                            <div className='d-flex align-items-center gap-2'>
                                <Form.Check
                                    type='switch'
                                    id='active-switch'
                                    label='Active Status'
                                    name='isActive'
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                {formData.isActive && (
                                    <CheckCircleFill className='text-success' />
                                )}
                            </div>
                            <Form.Text className='text-muted'>
                                Toggle to set the student's active status
                            </Form.Text>
                        </Form.Group>

                        <div className='d-flex gap-3 mt-4'>
                            <Button
                                variant='primary'
                                type='submit'
                                className='d-flex align-items-center gap-2 rounded-pill shadow-sm'
                                disabled={loading}
                            >
                                {loading && (
                                    <Spinner size='sm' animation='border' />
                                )}
                                <Save size={18} />
                                {mode === 'edit' ? 'Update' : 'Create'} Student
                            </Button>
                            <Link to='/' className='text-decoration-none'>
                                <Button
                                    variant='outline-secondary'
                                    className='rounded-pill shadow-sm'
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentForm;
