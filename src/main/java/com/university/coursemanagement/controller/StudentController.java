package com.university.coursemanagement.controller;

import com.university.coursemanagement.model.Student;
import com.university.coursemanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import java.util.Optional;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        // Check if studentId already exists
        if (studentRepository.existsByStudentId(student.getStudentId())) {
            return ResponseEntity
                    .badRequest()
                    .body("Student with ID " + student.getStudentId() + " already exists!");
        }

        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(savedStudent);
    }


    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (!studentOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Check if studentId exists in another record
        Optional<Student> duplicateCheck = studentRepository.findByStudentId(studentDetails.getStudentId());
        if (duplicateCheck.isPresent() && !duplicateCheck.get().getId().equals(id)) {
            return ResponseEntity
                    .badRequest()
                    .body("Student with ID " + studentDetails.getStudentId() + " already exists!");
        }

        Student student = studentOptional.get();
        student.setStudentId(studentDetails.getStudentId());
        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setCourse(studentDetails.getCourse());
        student.setRegistrationDate(studentDetails.getRegistrationDate());

        Student updatedStudent = studentRepository.save(student);
        return ResponseEntity.ok(updatedStudent);
    }
}
