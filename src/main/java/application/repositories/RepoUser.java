package application.repositories;

import application.Entities.User;
import application.utils.ServerException;
import application.interfaces.IRepoUser;
import application.utils.HibernateUtils;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

@Repository
public class RepoUser implements IRepoUser {
    SessionFactory sessionFactory;

    public RepoUser() {
        sessionFactory = HibernateUtils.getSessionFactory();
    }


    @Override
    public long saveUser(User user) throws ServerException{
        long id = -1;
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;

            tx = session.beginTransaction();

            if (findByEmail(user.getEmail()) != null)
                throw new ServerException("This email is used!");
            if (findByUsername(user.getUsername()) != null)
                throw new ServerException("This username is used!");

            id = (Long)  session.save(user);
            tx.commit();

        }
        return id;
    }


    @Override
    public User findByUsername(String username) {
        User found = null;
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                found = session.createQuery("from User where username=:username", User.class).setParameter("username", username)
                        .setMaxResults(1)
                        .uniqueResult();
                tx.commit();
            } catch (RuntimeException ex) {
                if (tx != null)
                    tx.rollback();
            }
        }
        return found;
    }


    @Override
    public User findByEmail(String email) {
        User found = null;
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                found = session.createQuery("from User where email=:email", User.class).setParameter("email", email)
                        .setMaxResults(1)
                        .uniqueResult();
                tx.commit();
            } catch (RuntimeException ex) {
                if (tx != null)
                    tx.rollback();
            }
        }
        return found;
    }


}
