package com.backend.intellicop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IntellicopApplication {

	public static void main(String[] args) {
		SpringApplication.run(IntellicopApplication.class, args);
	}

}
