package dev.silentcraft.sigil;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import dev.silentcraft.sigil.api.controller.TestConfig;

@SpringBootTest(
        properties = "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration")
@Import(TestConfig.class)
class SigilApplicationTests {

    @Test
    void contextLoads() {
    }

}
