package application.utils;

import application.Entities.Aliment;
import application.Entities.FridgeAliment;
import application.Entities.User;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;


/*
Used to get a session for Hibernate
 */
public class HibernateUtils {

    private static final SessionFactory sessionFactory = buildSessionFactory();

    private static SessionFactory buildSessionFactory() {
        try {
            Configuration configuration = new Configuration();
            configuration.addAnnotatedClass(Aliment.class);
            configuration.addAnnotatedClass(FridgeAliment.class);
            configuration.addAnnotatedClass(User.class);
            configuration.configure();

            StandardServiceRegistryBuilder standardServiceRegistryBuilder = new StandardServiceRegistryBuilder();
            standardServiceRegistryBuilder.applySettings(configuration.getProperties());
            ServiceRegistry serviceRegistry = standardServiceRegistryBuilder.build();

            return configuration.buildSessionFactory(serviceRegistry);
        }
        catch(Exception e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
}