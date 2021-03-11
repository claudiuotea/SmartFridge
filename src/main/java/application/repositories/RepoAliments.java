package application.repositories;

import application.Entities.Aliment;
import application.interfaces.IRepoAliments;
import application.utils.HibernateUtils;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Component;
import java.util.List;

/*
This is a repository used to manage the possible aliments used by the fridge
[here you add what the fridge can and cannot recognize based on the AI. From here we take what we actually have on fridge]
 */
@Component
public class RepoAliments implements IRepoAliments {
    SessionFactory sessionFactory;

    public RepoAliments() {
        sessionFactory = HibernateUtils.getSessionFactory();
    }

    @Override
    public int addAliment(Aliment a) {
        Session session = sessionFactory.openSession();
        Transaction tx = null;
        Integer alimentID = null;

        try {
            tx = session.beginTransaction();
            Aliment aliment = new Aliment();
            aliment.setDescription(a.getDescription());
            aliment.setType(a.getType());
            aliment.setUrl_img(a.getUrl_img());
            alimentID = (Integer) session.save(aliment);
            tx.commit();
        } catch (HibernateException e) {
            if (tx!=null) tx.rollback();
            e.printStackTrace();
        } finally {
            session.close();
        }
        return alimentID;
    }

    @Override
    public Aliment findAliment(int id) {
        Aliment aliment = null;
        try(Session session = sessionFactory.openSession()){
            Transaction tx=null;
            try{
                tx = session.beginTransaction();
                aliment = session.createQuery("from Aliment where id=:id", Aliment.class).setParameter("id",id)
                        .setMaxResults(1)
                        .uniqueResult();
                tx.commit();
            } catch(RuntimeException ex){
                if (tx!=null)
                    tx.rollback();
            }
        }
        return aliment;
    }

    @Override
    public void removeAliment(int id) {
        try(Session session = sessionFactory.openSession()){
            Transaction tx=null;
            try{
                tx = session.beginTransaction();
                Aliment crit= findAliment(id);
                session.delete(crit);
                tx.commit();
            } catch(RuntimeException ex){
                if (tx!=null)
                    tx.rollback();
            }
        }

    }

    @Override
    public Aliment[] getAllAliments() {
        Session session = sessionFactory.openSession();
        Transaction tx = null;
        Aliment[] alimentsArray = null;
        try {
            tx = session.beginTransaction();
            List aliments = session.createQuery("FROM Aliment ").list();
            alimentsArray = new Aliment[aliments.size()];
            aliments.toArray(alimentsArray);
            tx.commit();
        } catch (HibernateException e) {
            if (tx!=null) tx.rollback();
            e.printStackTrace();
        } finally {
            session.close();
        }
        return alimentsArray;
    }

    @Override
    public void updateAliment(Aliment a) {
        try(Session session = sessionFactory.openSession()){
            Transaction tx=null;
            try{
                tx = session.beginTransaction();
                Aliment aliment =
                        (Aliment) session.load( Aliment.class,a.getId() );
                aliment.setDescription(a.getDescription());
                aliment.setType(a.getType());
                aliment.setUrl_img(a.getUrl_img());
                tx.commit();
            } catch(RuntimeException ex){
                if (tx!=null)
                    tx.rollback();
            }
        }
    }

    @Override
    public String[] getAllTypes() {
        //return types
        return new String[3];
    }
}
