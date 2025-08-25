package com.university.coursemanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "course")  // Optional, but helps if DB table is named `course`
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer credits;

    public Course() {}

    public Course(String title, String code, String description, Integer credits) {
        this.title = title;
        this.code = code;
        this.description = description;
        this.credits = credits;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
}
