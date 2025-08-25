package com.university.coursemanagement.repository;

import com.university.coursemanagement.model.Mark;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MarkRepository extends JpaRepository<Mark, Long> {
    boolean existsByStudentIdAndCourseCode(String studentId, String courseCode);
}
