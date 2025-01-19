package com.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.repositories.NurseRepo;
import com.entities.Nurse;

@RestController
@RequestMapping("/api/nurses")
public class NurseController {
    private final NurseRepo nurseRepo;

    public NurseController(NurseRepo nurseRepo) {
        this.nurseRepo = nurseRepo;
    }

    @GetMapping
    public List<Nurse> getAllNurses() {
        return nurseRepo.findAll();
    }

    @PostMapping
    public Nurse createNurse(@RequestBody Nurse nurse) {
        return nurseRepo.save(nurse);
    }
}
