package com.backend.intellicop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "criminal_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriminalCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // BASIC CRIMINAL INFO
    private String name;
    private Integer age;
    private String crime;
    private String lastSeen;
    private String threat;
    private String status;

    @Column(length = 2000)
    private String record;

    // COMPLAINANT DETAILS
    private String complainantName;
    private String complainantMobile;
    private String complainantAddress;

    // INCIDENT DETAILS
    private String incidentDate;      // "2024-02-10"
    private String incidentTime;      // "14:30"
    private String incidentLocation;
    private String incidentType;

    @Column(length = 2000)
    private String incidentDescription;

    private String accusedName;
    private String victimName;

    // MEDIA
    private String photo;             // store URL or path, e.g. "/images/default-criminal.jpg"
    // For simplicity, not storing preview/evidenceFiles in DB.
}
