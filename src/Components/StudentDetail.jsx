import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Button,
    Container,
    Alert,
    Card,
    Badge,
    Row,
    Col,
    Spinner
} from 'react-bootstrap';
import {
    PersonBadge,
    Pencil,
    CheckCircleFill,
    XCircleFill,
    Calendar3,
    Hash,
    Person
} from 'react-bootstrap-icons';

const StudentDetail = () => {
    const [student, setStudent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchStudentDetail = async () => {
            try {
                const response = await axios.get(
                    `https://student-api-nestjs.onrender.com/students/${id}`
                );
                setStudent(response.data.data);
            } catch (err) {
                console.error('Error details:', err);
                setError('Error fetching student details');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetail();
    }, [id]);

    if (loading) {
        return (
            <Container
                className='d-flex justify-content-center align-items-center'
                style={{ minHeight: '50vh' }}
            >
                <Spinner animation='border' variant='primary' />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className='py-4'>
                <Alert
                    variant='danger'
                    className='d-flex align-items-center gap-2'
                >
                    <XCircleFill size={18} />
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!student) {
        return (
            <Container className='py-4'>
                <Alert
                    variant='warning'
                    className='d-flex align-items-center gap-2'
                >
                    <PersonBadge size={18} />
                    Student not found
                </Alert>
            </Container>
        );
    }

    return (
        <Container className='py-4'>
            <Card className='shadow-sm'>
                <Card.Header className='bg-white py-3'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex align-items-center gap-2'>
                            <PersonBadge size={24} className='text-primary' />
                            <h4 className='mb-0'>Student Details</h4>
                        </div>
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
                    <Row className='g-4'>
                        <Col md={6}>
                            <Card className='h-100 border-0 bg-light'>
                                <Card.Body>
                                    <h5 className='d-flex align-items-center gap-2 mb-4'>
                                        <Person className='text-primary' />
                                        Basic Information
                                    </h5>

                                    <div className='mb-3'>
                                        <div className='text-muted small mb-1'>
                                            <Hash size={14} /> Student Code
                                        </div>
                                        <div className='fs-5 fw-medium'>
                                            {student.studentCode}
                                        </div>
                                    </div>

                                    <div className='mb-3'>
                                        <div className='text-muted small mb-1'>
                                            <Person size={14} /> Full Name
                                        </div>
                                        <div className='fs-5 fw-medium'>
                                            {student.name}
                                        </div>
                                    </div>

                                    <div>
                                        <div className='text-muted small mb-1'>
                                            Status
                                        </div>
                                        <Badge
                                            bg={
                                                student.isActive
                                                    ? 'success'
                                                    : 'secondary'
                                            }
                                            className='d-inline-flex align-items-center gap-1 px-3 py-2'
                                        >
                                            {student.isActive ? (
                                                <>
                                                    <CheckCircleFill
                                                        size={12}
                                                    />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircleFill size={12} />
                                                    Inactive
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className='h-100 border-0 bg-light'>
                                <Card.Body>
                                    <h5 className='d-flex align-items-center gap-2 mb-4'>
                                        <Calendar3 className='text-primary' />
                                        Timeline
                                    </h5>

                                    <div className='position-relative'>
                                        <div
                                            className='position-absolute h-100'
                                            style={{
                                                width: '2px',
                                                backgroundColor: '#e9ecef',
                                                left: '7px'
                                            }}
                                        ></div>

                                        <div className='d-flex gap-3 mb-3'>
                                            <div
                                                className='rounded-circle bg-primary'
                                                style={{
                                                    width: '16px',
                                                    height: '16px'
                                                }}
                                            ></div>
                                            <div>
                                                <div className='text-muted small'>
                                                    Created At
                                                </div>
                                                <div>
                                                    {new Date(
                                                        student.createdAt
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='d-flex gap-3'>
                                            <div
                                                className='rounded-circle bg-primary'
                                                style={{
                                                    width: '16px',
                                                    height: '16px'
                                                }}
                                            ></div>
                                            <div>
                                                <div className='text-muted small'>
                                                    Last Updated
                                                </div>
                                                <div>
                                                    {new Date(
                                                        student.updatedAt
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className='d-flex gap-3 mt-4'>
                        <Link
                            to={`/edit-student/${student._id}`}
                            className='text-decoration-none'
                        >
                            <Button
                                variant='warning'
                                className='d-flex align-items-center gap-2 rounded-pill shadow-sm'
                            >
                                <Pencil size={18} />
                                Edit Student
                            </Button>
                        </Link>
                        <Link to='/' className='text-decoration-none'>
                            <Button
                                variant='outline-secondary'
                                className='rounded-pill shadow-sm'
                            >
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentDetail;
