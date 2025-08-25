package com.university.coursemanagement.repository;

import com.university.coursemanagement.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCode(String code);
}
