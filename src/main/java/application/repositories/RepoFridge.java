package application.repositories;

import application.DTOObjects.UpdateDTO;
import application.Entities.Aliment;
import application.Entities.FridgeAliment;
import application.utils.ServerException;
import application.interfaces.IRepoFridge;
import application.utils.HibernateUtils;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


/*
Repo coresponding to what the fridge actually has inside, and permit to change some data if needed
 */
@Component
public class RepoFridge implements IRepoFridge {
    SessionFactory sessionFactory;

    public RepoFridge() {
        sessionFactory = HibernateUtils.getSessionFactory();
    }

    @Override
    public FridgeAliment addAliment(String typeAliment, int quantity,int userId) {
        Session session = sessionFactory.openSession();
        Transaction tx = null;

        int idOfAliment=-1;//used to update if already exists in fridge
        FridgeAliment fridgeAliment = null;
        Aliment toFind = findAlimentByType(typeAliment);
        idOfAliment = toFind.getId();
        /*
        If it already was in the fridge, just update the quantity
         */
        if(findFridgeAliment(userId,idOfAliment) != null)
        {
            FridgeAliment fr= new FridgeAliment();
        fr.setAlimentId(idOfAliment);
        fr.setQuantity(quantity);
        fr.setUserId(userId);
        UpdateDTO u = new UpdateDTO();
        u.setQuantity(quantity);
        updateAliment(u,userId,idOfAliment);
        return fr;
        }
        else{    try {
            tx = session.beginTransaction();
            fridgeAliment = new FridgeAliment();
            fridgeAliment.setQuantity(quantity);
             fridgeAliment.setAlimentId(toFind.getId());
             fridgeAliment.setUserId(userId);
            session.save(fridgeAliment);
            tx.commit();
            return fridgeAliment;

        } catch (HibernateException e) {
            if (tx != null) tx.rollback();
            e.printStackTrace();

        } finally {
            session.close();
        }}

return null;
    }

    /*
    First, search in the fridge to see if the aliment id is present, and get it to know the quantity
    Return the Aliment after you set the quantity
     */
    @Override
    public Aliment findAliment(int userId,int alimentId) {
        FridgeAliment aliment = null;
        Aliment a = null;
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;

                tx = session.beginTransaction();
            aliment = session.createQuery("from FridgeAliment where userId=:userId and alimentId=:alimentId", FridgeAliment.class).setParameter("userId", userId)
                    .setParameter("alimentId",alimentId)
                    .setMaxResults(1)
                    .uniqueResult();
                if(aliment == null)
                    throw new ServerException("The aliment is not in the fridge.");
                a = session.find(Aliment.class, alimentId);
                a.setQuantity(aliment.getQuantity());
                tx.commit();

        }
        return a;
    }

    @Override
    public Aliment findAlimentByType(String type) {
        Aliment aliment = null;
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                aliment = session.createQuery("from Aliment where type=:type", Aliment.class).setParameter("type", type)
                        .setMaxResults(1)
                        .uniqueResult();
                tx.commit();
            } catch (RuntimeException ex) {
                if (tx != null)
                    tx.rollback();
            }
        }
        return aliment;
    }

    @Override
    public void removeAliment(int userId,int alimentId) {
        FridgeAliment crit = null;
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;
            tx = session.beginTransaction();
            crit = findFridgeAliment(userId,alimentId);
            if (crit == null)
                throw new ServerException("The aliment is not in the fridge.");
            session.delete(crit);
            tx.commit();

        }
    }

    //Get all the aliments from the fridge, put them in an array and return them
    @Override
    public Aliment[] getAllAliments(int userId) {
        Session session = sessionFactory.openSession();
        Transaction tx = null;
        Aliment[] toReturn = null;
        List<Aliment> alimentList = new ArrayList<>();
        try {
            tx = session.beginTransaction();
            List<FridgeAliment> aliments = session.createQuery("FROM FridgeAliment x where x.userId=:userId ")
                    .setParameter("userId",userId)
                    .getResultList();
            //go through the list,find each aliment and put it in a list
            aliments.forEach(x->alimentList.add(this.findAliment(userId,x.getAlimentId())));
            toReturn = new Aliment[alimentList.size()];
            alimentList.toArray(toReturn);
            tx.commit();
        } catch (HibernateException e) {
            if (tx != null) tx.rollback();
            e.printStackTrace();
        } finally {
            session.close();
        }
        return toReturn;
    }

    @Override
    public void updateAliment(UpdateDTO u, int userId, int alimentId) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                session.createQuery("UPDATE FridgeAliment SET quantity=:q where userId=:ui and alimentId=:ai")
            .setParameter("q",u.getQuantity())
            .setParameter("ui",userId)
            .setParameter("ai",alimentId)
                .executeUpdate();
            tx.commit();
            } catch (RuntimeException ex) {
                if (tx != null)
                    tx.rollback();
            }
        }
    }


    @Override
    public FridgeAliment findFridgeAliment(int userId,int alimentId) {
        FridgeAliment aliment = null;
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                aliment = (FridgeAliment) session.createQuery("from FridgeAliment a where a.userId=:userId and a.alimentId =:alimentId")
                .setParameter("alimentId",alimentId).setParameter("userId",userId)
                .setMaxResults(1).uniqueResult();
                tx.commit();
            } catch (RuntimeException ex) {
                if (tx != null)
                    tx.rollback();
            }
        }
        return aliment;
    }
}
