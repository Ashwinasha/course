package com.university.coursemanagement.repository;

import com.university.coursemanagement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Check if a student with this studentId exists
    boolean existsByStudentId(String studentId);

    // Find a student by studentId
    Optional<Student> findByStudentId(String studentId);
}
