package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entities.Nurse;

public interface NurseRepo extends JpaRepository<Nurse, Long> {

}
