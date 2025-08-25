package com.university.coursemanagement.controller;

import com.university.coursemanagement.model.Course;
import com.university.coursemanagement.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        if (courseRepository.existsByCode(course.getCode())) {
            return ResponseEntity.badRequest().body("Course code already exists!");
        }
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            // Check for duplicate code when updating
            if (!course.getCode().equals(updatedCourse.getCode()) &&
                courseRepository.existsByCode(updatedCourse.getCode())) {
                return ResponseEntity.badRequest().body("Course code already exists!");
            }

            course.setCode(updatedCourse.getCode());
            course.setTitle(updatedCourse.getTitle());
            course.setDescription(updatedCourse.getDescription());
            course.setCredits(updatedCourse.getCredits());

            return ResponseEntity.ok(courseRepository.save(course));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
