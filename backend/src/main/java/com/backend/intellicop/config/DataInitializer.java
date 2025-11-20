package com.backend.intellicop.config;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.backend.intellicop.Repository.CriminalCaseRepository;
import com.backend.intellicop.entity.CriminalCase;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedCriminalCases(CriminalCaseRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return; // Already seeded
            }

            // --- 1) Your original 4 cases but with only 3 statuses: In-Progress, Closed, Active ---

            CriminalCase c1 = CriminalCase.builder()
                    .name("Rohan Verma")
                    .age(28)
                    .crime("Theft")
                    .lastSeen("Mumbai Railway Station")
                    .threat("Medium")
                    .status("Active") // ✅ Changed from "Wanted" to "Active"
                    .record("Involved in multiple theft cases in local trains and crowded markets.")
                    .complainantName("Amit Sharma")
                    .complainantMobile("9876543210")
                    .complainantAddress("Sector 12, Navi Mumbai")
                    .incidentDate("2024-02-10")
                    .incidentTime("14:30")
                    .incidentLocation("CST Station, Mumbai")
                    .incidentType("Theft")
                    .incidentDescription("Suspect stole a backpack containing valuable electronics.")
                    .accusedName("Unknown")
                    .victimName("Amit Sharma")
                    .photo("/images/default-criminal.jpg")
                    .build();

            CriminalCase c2 = CriminalCase.builder()
                    .name("Sanjay Naik")
                    .age(34)
                    .crime("Assault")
                    .lastSeen("Hyderabad Banjara Hills")
                    .threat("High")
                    .status("In-Progress") // ✅ Changed from "Under Investigation"
                    .record("Accused of involvement in a violent altercation outside a nightclub.")
                    .complainantName("Rahul Singh")
                    .complainantMobile("9123456780")
                    .complainantAddress("Banjara Hills, Hyderabad")
                    .incidentDate("2024-01-25")
                    .incidentTime("23:15")
                    .incidentLocation("Night Owl Club, Hyderabad")
                    .incidentType("Assault")
                    .incidentDescription("Victim was physically attacked leading to minor injuries.")
                    .accusedName("Sanjay Naik")
                    .victimName("Rahul Singh")
                    .photo("/images/default-criminal.jpg")
                    .build();

            CriminalCase c3 = CriminalCase.builder()
                    .name("Priya Shetty")
                    .age(26)
                    .crime("Cyber Crime")
                    .lastSeen("Bangalore Electronic City")
                    .threat("Low")
                    .status("Closed") // ✅ Changed from "Captured"
                    .record("Involved in online scam targeting senior citizens through phishing calls.")
                    .complainantName("Suresh Kumar")
                    .complainantMobile("9988776655")
                    .complainantAddress("HSR Layout, Bangalore")
                    .incidentDate("2024-03-12")
                    .incidentTime("11:45")
                    .incidentLocation("Online")
                    .incidentType("Cyber Crime")
                    .incidentDescription("Used fake bank verification calls to collect OTPs from victims.")
                    .accusedName("Priya Shetty")
                    .victimName("Multiple victims")
                    .photo("/images/default-criminal.jpg")
                    .build();

            CriminalCase c4 = CriminalCase.builder()
                    .name("Mohammed Irfan")
                    .age(30)
                    .crime("Fraud")
                    .lastSeen("Pune City Mall")
                    .threat("Medium")
                    .status("Active") // ✅ Changed from "Wanted"
                    .record("Involved in credit card fraud rings operating across Maharashtra.")
                    .complainantName("Akshay Patil")
                    .complainantMobile("9090909090")
                    .complainantAddress("Kothrud, Pune")
                    .incidentDate("2024-02-05")
                    .incidentTime("16:00")
                    .incidentLocation("Pune City Mall")
                    .incidentType("Fraud")
                    .incidentDescription("Used cloned credit cards to purchase high-value items.")
                    .accusedName("Mohammed Irfan")
                    .victimName("Multiple cardholders")
                    .photo("/images/default-criminal.jpg")
                    .build();

            repository.saveAll(Arrays.asList(c1, c2, c3, c4));

            // --- 2) Generate additional 52+ cases (total >= 56)
            //      with ONLY In-Progress, Closed, Active statuses ---

            List<String> crimes = Arrays.asList(
                    "Theft", "Assault", "Cyber Crime", "Fraud", "Robbery",
                    "Vandalism", "Extortion", "Drug Trafficking", "Burglary", "Stalking"
            );
            List<String> cities = Arrays.asList(
                    "Mumbai", "Delhi", "Hyderabad", "Bangalore", "Pune",
                    "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Surat"
            );
            List<String> threatLevels = Arrays.asList("Low", "Medium", "High");

            // ✅ Only these 3 allowed now
            List<String> statuses = Arrays.asList(
                    "In-Progress",
                    "Closed",
                    "Active"
            );

            Random random = new Random();

            for (int i = 5; i <= 56; i++) {
                String crime = crimes.get(random.nextInt(crimes.size()));
                String city = cities.get(random.nextInt(cities.size()));
                String threat = threatLevels.get(random.nextInt(threatLevels.size()));
                String status = statuses.get(random.nextInt(statuses.size())); // ✅ will be only one of the 3

                int age = 20 + random.nextInt(25);
                int day = 1 + random.nextInt(28);
                int month = 1 + random.nextInt(12);
                String date = String.format("2024-%02d-%02d", month, day);
                String time = String.format("%02d:%02d", random.nextInt(24), random.nextInt(60));

                CriminalCase auto = CriminalCase.builder()
                        .name("Suspect " + i)
                        .age(age)
                        .crime(crime)
                        .lastSeen(city + " - Area " + (random.nextInt(20) + 1))
                        .threat(threat)
                        .status(status) // ✅ only In-Progress / Closed / Active
                        .record("Automatically generated record for demonstration purposes. Case number " + i + ".")
                        .complainantName("Complainant " + i)
                        .complainantMobile("9" + (100000000 + random.nextInt(899999999)))
                        .complainantAddress("Neighborhood " + (random.nextInt(50) + 1) + ", " + city)
                        .incidentDate(date)
                        .incidentTime(time)
                        .incidentLocation("Location " + (random.nextInt(100) + 1) + ", " + city)
                        .incidentType(crime)
                        .incidentDescription("Detailed description for case " + i + " involving " + crime.toLowerCase() + " in " + city + ".")
                        .accusedName("Unknown")
                        .victimName("Victim " + i)
                        .photo("/images/default-criminal.jpg")
                        .build();

                repository.save(auto);
            }
        };
    }
}
