package com.backend.intellicop.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.intellicop.entity.VisitorMeeting;

public interface VisitorMeetingRepository extends JpaRepository<VisitorMeeting, Long> {

    List<VisitorMeeting> findByScheduledDate(LocalDate date);

    List<VisitorMeeting> findByScheduledDateAfter(LocalDate date);
}
