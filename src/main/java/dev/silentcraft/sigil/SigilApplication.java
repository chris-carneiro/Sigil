package dev.silentcraft.sigil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;

@SpringBootApplication(exclude = RedisRepositoriesAutoConfiguration.class)
public class SigilApplication {

	public static void main(String[] args) {
		SpringApplication.run(SigilApplication.class, args);
	}


}
