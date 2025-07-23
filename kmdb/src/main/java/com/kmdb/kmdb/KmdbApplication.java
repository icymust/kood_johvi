package com.kmdb.kmdb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.kmdb.kmdb")
public class KmdbApplication {

	public static void main(String[] args) {
		SpringApplication.run(KmdbApplication.class, args);
	}

}