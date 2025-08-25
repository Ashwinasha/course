package com.university.coursemanagement.controller;

import com.university.coursemanagement.model.Mark;
import com.university.coursemanagement.repository.MarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "http://localhost:3000")
public class MarkController {

    @Autowired
    private MarkRepository markRepository;

    @GetMapping
    public List<Mark> getAllMarks() {
        return markRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addMark(@RequestBody Mark mark) {
        // Check if a mark already exists for the same student and course
        boolean exists = markRepository.existsByStudentIdAndCourseCode(mark.getStudentId(), mark.getCourseCode());
        if (exists) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // 409 Conflict
                    .body("Mark for this student and course already exists!");
        }
        Mark savedMark = markRepository.save(mark);
        return ResponseEntity.ok(savedMark);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMark(@PathVariable Long id, @RequestBody Mark updatedMark) {
        return markRepository.findById(id)
                .map(mark -> {
                    mark.setStudentId(updatedMark.getStudentId());
                    mark.setCourseCode(updatedMark.getCourseCode());
                    mark.setMarks(updatedMark.getMarks());
                    return ResponseEntity.ok(markRepository.save(mark));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMark(@PathVariable Long id) {
        if (!markRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        markRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
