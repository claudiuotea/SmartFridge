package application.Entities;

import com.sun.istack.NotNull;

import javax.persistence.*;

//This entity will be used for the AlimentController.
@Entity
@Table(name = "ALIMENT")
public class Aliment {
    @Id@GeneratedValue
    @Column(name = "id")
    private int id;

    @NotNull
    @Column(name="type",nullable = false)
    private String type;
    @NotNull
    @Column(name="description",nullable = false)
    private String description;
    @NotNull
    @Column(name="url_img",nullable = false)
    private String url_img;

    public Aliment() {
    }

    @Transient
    private int quantity;

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Aliment(Aliment a){
        this.id = a.getId();
        this.type=a.getType();
        this.description=a.getDescription();
        this.url_img=a.getUrl_img();
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl_img() {
        return url_img;
    }

    public void setUrl_img(String url_img) {
        this.url_img = url_img;
    }
}
