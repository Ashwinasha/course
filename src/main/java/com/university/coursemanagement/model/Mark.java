package com.university.coursemanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "mark", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "course_code"})
})
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;
    private String courseCode;
    private double marks;
    private double gpa;
    private String grade;
    private LocalDateTime recordedAt = LocalDateTime.now();

    // Auto-calculation
    public void calculateGpaAndGrade() {
        if (marks >= 85) {
            gpa = 4.0;
            grade = "A";
        } else if (marks >= 75) {
            gpa = 3.5;
            grade = "B+";
        } else if (marks >= 65) {
            gpa = 3.0;
            grade = "B";
        } else if (marks >= 55) {
            gpa = 2.5;
            grade = "C";
        } else if (marks >= 40) {
            gpa = 2.0;
            grade = "D";
        } else {
            gpa = 0.0;
            grade = "F";
        }
    }

    @PrePersist
    @PreUpdate
    public void prePersistOrUpdate() {
        calculateGpaAndGrade();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public double getMarks() { return marks; }
    public void setMarks(double marks) { this.marks = marks; }

    public double getGpa() { return gpa; }
    public String getGrade() { return grade; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
}
